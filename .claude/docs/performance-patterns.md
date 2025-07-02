# 14Voices Performance Architecture

## Caching Strategy

- Multi-layer: LRU (memory) + Redis (distributed) + TTL
- Cache hit rate target: >80%
- Monitor via `/api/cache/metrics`

## Database Optimization

- Query optimizer eliminates N+1 queries
- Performance indexes for all searchable fields
- Target: <50ms query response time
- Monitor via performance-monitor.ts

## API Performance

- Target: <200ms response time
- Rate limiting per endpoint
- Health monitoring via `/api/health/*`
- Batch processing: 1000+/min email throughput

## Key Monitoring Endpoints

- `/api/cache/metrics` - Cache performance
- `/api/health/email-system` - Email system status
- `/api/admin/email-stats` - Email statistics
