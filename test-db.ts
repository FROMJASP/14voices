import { Pool } from 'pg'

async function testConnection() {
  console.log('Testing database connection...')
  
  const connectionString = process.env.POSTGRES_URL
  
  if (!connectionString) {
    console.error('❌ POSTGRES_URL is not set')
    return
  }
  
  console.log('✅ POSTGRES_URL is set')
  
  try {
    const pool = new Pool({
      connectionString,
    })
    
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful!')
    console.log('Current time from DB:', result.rows[0].now)
    
    await pool.end()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testConnection()