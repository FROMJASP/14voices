# n8n Security Best Practices for Production Deployment

## 1. Environment Variable Configuration

### Critical Security Variables

```env
# Authentication & Security
N8N_BASIC_AUTH_ACTIVE=false  # Disable when using user management
N8N_USER_MANAGEMENT_DISABLED=false  # Enable user management for production

# Encryption Keys (Generate unique 32+ character strings)
N8N_ENCRYPTION_KEY=<generate-strong-encryption-key>
N8N_USER_MANAGEMENT_JWT_SECRET=<generate-strong-jwt-secret>

# Session Security
N8N_AUTH_COOKIE_SECURE=true  # Force HTTPS cookies
N8N_AUTH_COOKIE_NAME=n8n-auth
N8N_AUTH_COOKIE_MAX_AGE=604800  # 7 days in seconds

# Security Headers
N8N_SECURITY_AUDIT_DAYS_ABANDONED_EXECUTIONS=90
N8N_SECURITY_BLOCK_FILE_ACCESS_TO_N8N_FILES=true

# Webhook Security
N8N_WEBHOOK_TEST_URL=https://your-domain.com/webhook-test
WEBHOOK_URL=https://your-domain.com/webhook

# External Service Isolation
N8N_EXCLUDE_NODES=  # Comma-separated list of nodes to disable
N8N_PUSH_BACKEND=websocket
N8N_PAYLOAD_SIZE_MAX=16  # MB

# Execution Security
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_ON_PROGRESS=true
EXECUTIONS_DATA_MAX_AGE=336  # 14 days retention

# Database (PostgreSQL recommended for production)
DATABASE_TYPE=postgresdb
DATABASE_POSTGRESDB_DATABASE=n8n
DATABASE_POSTGRESDB_HOST=postgres
DATABASE_POSTGRESDB_PORT=5432
DATABASE_POSTGRESDB_USER=n8n_user
DATABASE_POSTGRESDB_PASSWORD=<strong-database-password>
DATABASE_POSTGRESDB_SCHEMA=public

# Rate Limiting
N8N_RATE_LIMIT_ENABLED=true
N8N_RATE_LIMIT_PER_MINUTE=60

# Monitoring & Logging
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console
N8N_METRICS=true
N8N_METRICS_PREFIX=n8n_
```

### Generating Secure Keys

```bash
# Generate encryption key
openssl rand -base64 32

# Generate JWT secret
openssl rand -hex 32

# Generate database password
openssl rand -base64 24
```

## 2. Network Isolation Recommendations

### Docker Network Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    networks:
      - n8n-internal
      - coolify
    expose:
      - '5678' # Only expose internally, not to host
    environment:
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - N8N_HOST=your-n8n-domain.com

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    networks:
      - n8n-internal # Only on internal network
    environment:
      POSTGRES_USER: n8n_user
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: n8n
    volumes:
      - postgres-data:/var/lib/postgresql/data

networks:
  n8n-internal:
    internal: true # No external access
  coolify:
    external: true # Coolify managed network

volumes:
  postgres-data:
```

### Firewall Rules

```bash
# If using UFW (Ubuntu Firewall)
# Allow only Coolify proxy to access n8n
ufw allow from <coolify-proxy-ip> to any port 5678

# Block direct access to n8n port
ufw deny 5678

# Allow HTTPS traffic through Coolify
ufw allow 443/tcp
ufw allow 80/tcp  # For Let's Encrypt challenges
```

## 3. Authentication Setup

### User Management Configuration (Recommended)

```env
# Enable user management for production
N8N_USER_MANAGEMENT_DISABLED=false

# Email configuration for invites
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.example.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=notifications@yourdomain.com
N8N_SMTP_PASS=<smtp-password>
N8N_SMTP_SENDER=n8n@yourdomain.com
N8N_SMTP_SSL=true

# User signup restrictions
N8N_USER_MANAGEMENT_EMAILS_ALLOWED=admin@company.com,team@company.com
```

### Initial Admin Setup

```bash
# After first deployment, create admin user via CLI
docker exec -it n8n-container n8n user-management:create \
  --email admin@company.com \
  --password <strong-initial-password> \
  --firstName Admin \
  --lastName User
```

### RBAC Configuration

```env
# Role-based access control
N8N_USER_MANAGEMENT_RBAC=true
N8N_LICENSE_KEY=<your-license-key>  # Required for RBAC

# Default user role
N8N_USER_MANAGEMENT_DEFAULT_ROLE=member
```

## 4. SSL/TLS Configuration via Coolify

### Coolify SSL Settings

1. **In Coolify Application Settings:**
   - Enable "Force HTTPS"
   - Enable "Auto-generate SSL"
   - Set domain: `n8n.yourdomain.com`

2. **Environment Variables for SSL:**

```env
N8N_PROTOCOL=https
N8N_HOST=n8n.yourdomain.com
N8N_AUTH_COOKIE_SECURE=true
N8N_PUSH_BACKEND=websocket
WEBHOOK_URL=https://n8n.yourdomain.com/webhook
```

3. **Headers Configuration:**

```env
# Security headers (Coolify can also set these)
N8N_SECURITY_RESPONSE_HEADERS='{
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''; style-src '\''self'\'' '\''unsafe-inline'\''"
}'
```

## 5. Firewall Rules

### Host-Level Firewall

```bash
#!/bin/bash
# n8n-firewall.sh

# Reset firewall
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (adjust port as needed)
ufw allow 22/tcp

# Allow HTTP/HTTPS (through Coolify proxy)
ufw allow 80/tcp
ufw allow 443/tcp

# Allow Docker networks (adjust subnet as needed)
ufw allow from 172.16.0.0/12

# Block direct n8n access
ufw deny 5678

# Enable firewall
ufw --force enable
```

### Docker-Level Isolation

```yaml
# In docker-compose.yml
services:
  n8n:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETUID
      - SETGID
    read_only: true
    tmpfs:
      - /tmp
      - /home/node/.n8n
```

## 6. Backup Strategies

### Automated Backup Script

```bash
#!/bin/bash
# n8n-backup.sh

# Configuration
BACKUP_DIR="/backups/n8n"
RETENTION_DAYS=30
DB_CONTAINER="n8n-postgres"
N8N_DATA_DIR="/data/n8n"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup database
docker exec "$DB_CONTAINER" pg_dump -U n8n_user n8n | \
  gzip > "$BACKUP_DIR/n8n_db_$TIMESTAMP.sql.gz"

# Backup n8n data (workflows, credentials)
tar -czf "$BACKUP_DIR/n8n_data_$TIMESTAMP.tar.gz" \
  -C "$N8N_DATA_DIR" .

# Backup environment
cp /path/to/.env "$BACKUP_DIR/n8n_env_$TIMESTAMP.env"

# Clean old backups
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

# Upload to external storage (optional)
# rclone copy "$BACKUP_DIR" remote:n8n-backups/
```

### Backup Schedule (Crontab)

```bash
# Daily backups at 2 AM
0 2 * * * /path/to/n8n-backup.sh >> /var/log/n8n-backup.log 2>&1

# Weekly full backup on Sunday
0 3 * * 0 /path/to/n8n-full-backup.sh >> /var/log/n8n-backup.log 2>&1
```

### Restore Procedure

```bash
#!/bin/bash
# n8n-restore.sh

# Stop n8n
docker-compose stop n8n

# Restore database
gunzip < backup/n8n_db_20240120_020000.sql.gz | \
  docker exec -i n8n-postgres psql -U n8n_user n8n

# Restore data files
tar -xzf backup/n8n_data_20240120_020000.tar.gz \
  -C /data/n8n

# Start n8n
docker-compose start n8n
```

## 7. Access Control Recommendations

### API Security

```env
# API endpoint security
N8N_PUBLIC_API_DISABLED=false  # Enable if needed
N8N_PUBLIC_API_ENDPOINT_WHITELIST=workflows,executions

# Webhook authentication
N8N_WEBHOOK_AUTHENTICATION_METHOD=jwt
N8N_WEBHOOK_JWT_SECRET=<webhook-jwt-secret>
```

### IP Whitelisting

```nginx
# In Coolify custom nginx config
location / {
    # Whitelist company IPs
    allow 203.0.113.0/24;  # Office network
    allow 198.51.100.0/24; # VPN range
    deny all;

    proxy_pass http://n8n:5678;
}
```

### User Permissions Matrix

| Role   | Workflows       | Credentials | Users  | Settings |
| ------ | --------------- | ----------- | ------ | -------- |
| Owner  | Full            | Full        | Full   | Full     |
| Admin  | Full            | Full        | Manage | Read     |
| Member | Create/Edit Own | Use Only    | -      | -        |
| Guest  | View Only       | -           | -      | -        |

### Security Monitoring

```env
# Audit logging
N8N_AUDIT_ENABLED=true
N8N_AUDIT_DESTINATIONS=file,syslog
N8N_AUDIT_FILE_LOCATION=/data/logs/n8n-audit.log

# Failed login tracking
N8N_AUTH_MAX_LOGIN_ATTEMPTS=5
N8N_AUTH_LOGIN_LOCKOUT_TIME=600  # 10 minutes
```

### Credential Security

```env
# Credential encryption
N8N_ENCRYPTION_KEY=<32-char-key>
N8N_CREDENTIALS_OVERWRITE_ALLOW=false

# Restrict credential access
N8N_CREDENTIALS_SHARING_ENABLED=false
```

## Production Checklist

- [ ] User management enabled (not basic auth)
- [ ] Strong encryption keys generated
- [ ] PostgreSQL database (not SQLite)
- [ ] SSL/TLS configured via Coolify
- [ ] Security headers configured
- [ ] Network isolation implemented
- [ ] Firewall rules active
- [ ] Regular backups scheduled
- [ ] Monitoring configured
- [ ] Rate limiting enabled
- [ ] Audit logging active
- [ ] IP whitelisting (if applicable)
- [ ] Strong password policy enforced
- [ ] Regular security updates scheduled

## Monitoring Commands

```bash
# Check active connections
docker exec n8n-container netstat -tuln

# Monitor logs
docker logs -f n8n-container --tail 100

# Check resource usage
docker stats n8n-container

# Audit failed logins
grep "Login failed" /data/logs/n8n-audit.log

# Monitor webhook activity
tail -f /data/logs/n8n-audit.log | grep webhook
```

## Security Update Process

1. **Regular Updates:**

   ```bash
   # Update n8n image
   docker pull n8nio/n8n:latest

   # Backup before update
   ./n8n-backup.sh

   # Update via Coolify or docker-compose
   docker-compose up -d
   ```

2. **Security Patches:**
   - Subscribe to n8n security advisories
   - Test updates in staging first
   - Schedule maintenance windows
   - Have rollback plan ready

3. **Dependency Scanning:**
   ```bash
   # Scan container for vulnerabilities
   trivy image n8nio/n8n:latest
   ```
