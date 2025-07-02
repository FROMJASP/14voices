import { Payload } from 'payload'
import { sql } from 'drizzle-orm'

interface QueryStats {
  query: string
  calls: number
  totalTime: number
  meanTime: number
  rows: number
}

interface IndexUsage {
  tableName: string
  indexName: string
  indexScans: number
  indexSize: string
  isUnused: boolean
}

interface TableStats {
  tableName: string
  rowCount: number
  tableSize: string
  indexSize: string
  totalSize: string
  lastVacuum: Date | null
  lastAnalyze: Date | null
}

export class DatabasePerformanceMonitor {
  constructor(private payload: Payload) {}

  /**
   * Get slow queries from pg_stat_statements
   */
  async getSlowQueries(thresholdMs: number = 100): Promise<QueryStats[]> {
    try {
      const result = await this.payload.db.execute(sql`
        SELECT 
          query,
          calls,
          total_exec_time as total_time,
          mean_exec_time as mean_time,
          rows
        FROM pg_stat_statements
        WHERE mean_exec_time > ${thresholdMs}
        ORDER BY mean_exec_time DESC
        LIMIT 20
      `)

      return result.rows as QueryStats[]
    } catch (error) {
      console.error('Error fetching slow queries:', error)
      return []
    }
  }

  /**
   * Get index usage statistics
   */
  async getIndexUsage(): Promise<IndexUsage[]> {
    try {
      const result = await this.payload.db.execute(sql`
        SELECT
          schemaname || '.' || tablename as table_name,
          indexrelname as index_name,
          idx_scan as index_scans,
          pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
          idx_scan = 0 as is_unused
        FROM pg_stat_user_indexes
        ORDER BY idx_scan, pg_relation_size(indexrelid) DESC
      `)

      return result.rows.map(row => ({
        tableName: row.table_name as string,
        indexName: row.index_name as string,
        indexScans: Number(row.index_scans),
        indexSize: row.index_size as string,
        isUnused: Boolean(row.is_unused),
      }))
    } catch (error) {
      console.error('Error fetching index usage:', error)
      return []
    }
  }

  /**
   * Get table statistics
   */
  async getTableStats(): Promise<TableStats[]> {
    try {
      const result = await this.payload.db.execute(sql`
        SELECT
          schemaname || '.' || tablename as table_name,
          n_live_tup as row_count,
          pg_size_pretty(pg_table_size(schemaname||'.'||tablename)) as table_size,
          pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
          last_vacuum,
          last_analyze
        FROM pg_stat_user_tables
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `)

      return result.rows.map(row => ({
        tableName: row.table_name as string,
        rowCount: Number(row.row_count),
        tableSize: row.table_size as string,
        indexSize: row.index_size as string,
        totalSize: row.total_size as string,
        lastVacuum: row.last_vacuum ? new Date(row.last_vacuum as string) : null,
        lastAnalyze: row.last_analyze ? new Date(row.last_analyze as string) : null,
      }))
    } catch (error) {
      console.error('Error fetching table stats:', error)
      return []
    }
  }

  /**
   * Check for missing indexes based on query patterns
   */
  async getMissingIndexes(): Promise<string[]> {
    const recommendations: string[] = []

    try {
      // Check for missing indexes on foreign keys
      const fkResult = await this.payload.db.execute(sql`
        SELECT
          'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_' || 
          tc.table_name || '_' || kcu.column_name || 
          ' ON "' || tc.table_name || '"(' || kcu.column_name || ');' as index_sql
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND NOT EXISTS (
          SELECT 1
          FROM pg_indexes
          WHERE tablename = tc.table_name
          AND indexdef LIKE '%(' || kcu.column_name || ')%'
        )
      `)

      recommendations.push(...fkResult.rows.map(row => row.index_sql as string))

      // Check for missing indexes on commonly filtered columns
      const commonFilters = [
        { table: 'voiceovers', columns: ['status', 'created_at', 'slug'] },
        { table: 'email-jobs', columns: ['status', 'scheduled_for', 'recipient'] },
        { table: 'email-contacts', columns: ['email', 'subscribed'] },
        { table: 'bookings', columns: ['customer', 'status', 'voiceover'] },
      ]

      for (const { table, columns } of commonFilters) {
        for (const column of columns) {
          const checkResult = await this.payload.db.execute(sql`
            SELECT COUNT(*) as count
            FROM pg_indexes
            WHERE tablename = ${table}
            AND indexdef LIKE ${`%(${column})%`}
          `)

          if (checkResult.rows[0]?.count === 0) {
            recommendations.push(
              `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_${table}_${column} ON "${table}"(${column});`
            )
          }
        }
      }
    } catch (error) {
      console.error('Error checking missing indexes:', error)
    }

    return recommendations
  }

  /**
   * Analyze query performance for a specific query
   */
  async explainQuery(query: string): Promise<any[]> {
    try {
      const result = await this.payload.db.execute(sql`EXPLAIN ANALYZE ${sql.raw(query)}`)
      return result.rows
    } catch (error) {
      console.error('Error explaining query:', error)
      return []
    }
  }

  /**
   * Get database connection statistics
   */
  async getConnectionStats(): Promise<{
    active: number
    idle: number
    idleInTransaction: number
    total: number
    maxConnections: number
  }> {
    try {
      const activityResult = await this.payload.db.execute(sql`
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity
        WHERE datname = current_database()
        GROUP BY state
      `)

      const maxResult = await this.payload.db.execute(sql`
        SELECT setting::int as max_connections 
        FROM pg_settings 
        WHERE name = 'max_connections'
      `)

      const stats = {
        active: 0,
        idle: 0,
        idleInTransaction: 0,
        total: 0,
        maxConnections: Number(maxResult.rows[0]?.max_connections || 100),
      }

      for (const row of activityResult.rows) {
        const count = Number(row.count)
        stats.total += count

        switch (row.state) {
          case 'active':
            stats.active = count
            break
          case 'idle':
            stats.idle = count
            break
          case 'idle in transaction':
            stats.idleInTransaction = count
            break
        }
      }

      return stats
    } catch (error) {
      console.error('Error fetching connection stats:', error)
      return {
        active: 0,
        idle: 0,
        idleInTransaction: 0,
        total: 0,
        maxConnections: 100,
      }
    }
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(): Promise<{
    slowQueries: QueryStats[]
    unusedIndexes: IndexUsage[]
    missingIndexes: string[]
    tableStats: TableStats[]
    connectionStats: any
    recommendations: string[]
  }> {
    const [
      slowQueries,
      indexUsage,
      missingIndexes,
      tableStats,
      connectionStats,
    ] = await Promise.all([
      this.getSlowQueries(),
      this.getIndexUsage(),
      this.getMissingIndexes(),
      this.getTableStats(),
      this.getConnectionStats(),
    ])

    const unusedIndexes = indexUsage.filter(idx => idx.isUnused)
    const recommendations: string[] = []

    // Generate recommendations
    if (slowQueries.length > 0) {
      recommendations.push(
        `Found ${slowQueries.length} slow queries. Consider adding indexes or optimizing these queries.`
      )
    }

    if (unusedIndexes.length > 0) {
      recommendations.push(
        `Found ${unusedIndexes.length} unused indexes consuming ${
          unusedIndexes.reduce((acc, idx) => acc + idx.indexSize, '')
        }. Consider dropping them.`
      )
    }

    if (missingIndexes.length > 0) {
      recommendations.push(
        `Found ${missingIndexes.length} potentially missing indexes. Review and create as needed.`
      )
    }

    const tablesNeedingVacuum = tableStats.filter(
      t => !t.lastVacuum || (Date.now() - t.lastVacuum.getTime()) > 7 * 24 * 60 * 60 * 1000
    )
    if (tablesNeedingVacuum.length > 0) {
      recommendations.push(
        `${tablesNeedingVacuum.length} tables haven't been vacuumed in over 7 days.`
      )
    }

    if (connectionStats.idleInTransaction > 5) {
      recommendations.push(
        `${connectionStats.idleInTransaction} idle transactions detected. This can cause locking issues.`
      )
    }

    return {
      slowQueries,
      unusedIndexes,
      missingIndexes,
      tableStats,
      connectionStats,
      recommendations,
    }
  }
}