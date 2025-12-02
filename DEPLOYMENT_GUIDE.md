# DEPLOYMENT GUIDE

Complete guide for deploying BIMS to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Security Considerations](#security-considerations)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] No console errors in development
- [ ] Code reviewed and approved
- [ ] Environment variables documented
- [ ] Dependencies updated: `npm update`

### Security
- [ ] No hardcoded secrets in code
- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGIN configured correctly
- [ ] Database passwords are strong
- [ ] HTTPS enabled on server

### Documentation
- [ ] README.md updated
- [ ] API documentation current
- [ ] Setup instructions verified
- [ ] Changelog updated

### Performance
- [ ] Frontend bundle size optimized
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Images optimized

---

## Backend Deployment

### Option 1: DigitalOcean / AWS EC2 / Linode

#### 1. Server Setup
```bash
# Connect to your server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install -y mysql-server

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx
```

#### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/your-username/bims.git
cd bims/backend
```

#### 3. Setup Environment
```bash
# Create .env with production values
nano .env
```

Add production configuration:
```env
PORT=4000
NODE_ENV=production
DB_NAME=bims_prod
DB_USER=bims_user
DB_PASS=strong_password_here
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=very_long_random_secret_key_here
CORS_ORIGIN=https://yourdomain.com
```

#### 4. Install & Start Backend
```bash
# Install dependencies
npm install

# Build if needed
npm run build

# Start with PM2
pm2 start src/server.js --name "bims-api" --env production
pm2 save
pm2 startup

# Check status
pm2 status
```

#### 5. Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/bims-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/bims-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
sudo systemctl enable certbot
```

### Option 2: Heroku

#### 1. Setup Heroku CLI
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

#### 2. Create Heroku App
```bash
cd backend
heroku create bims-api-prod
```

#### 3. Add Database Add-on
```bash
heroku addons:create cleardb:ignite --app bims-api-prod
```

#### 4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production --app bims-api-prod
heroku config:set JWT_SECRET=your_secret_key --app bims-api-prod
heroku config:set CORS_ORIGIN=https://yourdomain.com --app bims-api-prod
```

#### 5. Update Procfile
Create `Procfile` in backend:
```
web: node src/server.js
```

#### 6. Deploy
```bash
git push heroku main
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
cd frontend
vercel --prod
```

#### 3. Configure Environment
Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Option 2: Netlify

#### 1. Build Frontend
```bash
cd frontend
npm run build
```

#### 2. Deploy on Netlify
- Go to https://app.netlify.com
- Click "New site from Git"
- Select repository
- Build command: `npm run build`
- Publish directory: `dist`

#### 3. Set Environment Variables
In Netlify dashboard:
- Go to Site settings → Build & deploy → Environment
- Add: `VITE_API_URL=https://api.yourdomain.com/api`

### Option 3: AWS S3 + CloudFront

#### 1. Build Frontend
```bash
cd frontend
npm run build
```

#### 2. Upload to S3
```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Upload
aws s3 sync dist/ s3://your-bucket-name/
```

#### 3. Setup CloudFront
- Create distribution pointing to S3
- Enable HTTPS
- Update DNS to CloudFront domain

### Option 4: Traditional Server (Nginx)

#### 1. Build Frontend
```bash
cd frontend
npm run build
```

#### 2. Upload to Server
```bash
scp -r dist/* root@your_server_ip:/var/www/html/
```

#### 3. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/bims-web
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api.yourdomain.com;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/bims-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup SSL
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Database Setup

### Production MySQL Setup

#### 1. Create Database
```sql
CREATE DATABASE bims_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bims_user'@'localhost' IDENTIFIED BY 'strong_password_123';
GRANT ALL PRIVILEGES ON bims_prod.* TO 'bims_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Backup Strategy
```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mysqldump -u bims_user -p bims_prod > $BACKUP_DIR/bims_$TIMESTAMP.sql

# Compress
gzip $BACKUP_DIR/bims_$TIMESTAMP.sql

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

#### 3. Schedule Daily Backups
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Database Migration

For existing installations:
```bash
# Backup current database
mysqldump -u root -p bims_db > backup.sql

# Update .env with new database credentials
# Backend will auto-sync schema on startup
npm run dev
```

---

## Security Considerations

### Environment Variables
- [ ] Never commit `.env` files
- [ ] Use strong, unique passwords
- [ ] Rotate keys periodically
- [ ] Use environment-specific secrets

### Database Security
- [ ] Create dedicated database user
- [ ] Use strong passwords (20+ chars)
- [ ] Limit database user privileges
- [ ] Enable database backups
- [ ] Use SSL for database connections

### Application Security
- [ ] Enable HTTPS/SSL everywhere
- [ ] Set secure CORS policy
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use parameterized queries
- [ ] Keep dependencies updated
- [ ] Regular security audits

### Server Security
- [ ] Disable root SSH login
- [ ] Configure firewall
  ```bash
  sudo ufw enable
  sudo ufw allow 80
  sudo ufw allow 443
  sudo ufw allow 22
  ```
- [ ] Use SSH keys instead of passwords
- [ ] Enable automatic security updates
- [ ] Monitor server logs
- [ ] Disable unnecessary services

### API Security
```javascript
// Example middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## Monitoring & Maintenance

### Application Monitoring

#### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Save logs
pm2 save
pm2 startup

# Log locations
pm2 logs bims-api
```

#### Health Check Endpoint
```bash
curl http://api.yourdomain.com/health
```

### Log Management

#### Centralized Logging with ELK Stack
```bash
# Install Filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.14.0-amd64.deb
sudo dpkg -i filebeat-7.14.0-amd64.deb
```

#### View Logs
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# PM2 logs
pm2 logs bims-api

# System logs
sudo journalctl -xe
```

### Database Maintenance

#### Regular Optimization
```sql
-- Optimize tables
OPTIMIZE TABLE resident;
OPTIMIZE TABLE household;
OPTIMIZE TABLE certificate;

-- Check table integrity
CHECK TABLE resident;
REPAIR TABLE resident;
```

#### Monitor Database Size
```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'bims_prod'
ORDER BY size_mb DESC;
```

### Performance Optimization

#### Caching Strategy
```javascript
// Redis caching example
const redis = require('redis');
const client = redis.createClient();

app.get('/residents', async (req, res) => {
  const cacheKey = `residents_${JSON.stringify(req.query)}`;
  
  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  const data = await Resident.findAll();
  await client.setEx(cacheKey, 3600, JSON.stringify(data));
  
  res.json(data);
});
```

#### Database Indexing
```sql
-- Add indexes for common queries
CREATE INDEX idx_resident_name ON resident(first_name, last_name);
CREATE INDEX idx_resident_household ON resident(household_id);
CREATE INDEX idx_certificate_resident ON certificate(resident_id);
CREATE INDEX idx_blotter_resident ON blotter(resident_id);
```

### Uptime Monitoring

#### UptimeRobot
1. Go to https://uptimerobot.com
2. Create monitor for: https://api.yourdomain.com
3. Set check interval: every 5 minutes
4. Enable notifications

### Regular Maintenance

#### Weekly Tasks
- [ ] Check error logs
- [ ] Verify backups
- [ ] Monitor disk space
- [ ] Review security alerts

#### Monthly Tasks
- [ ] Update dependencies
- [ ] Audit access logs
- [ ] Review database size
- [ ] Performance review

#### Quarterly Tasks
- [ ] Security audit
- [ ] Load testing
- [ ] Disaster recovery test
- [ ] Documentation review

---

## Troubleshooting Deployment

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs bims-api

# Check environment variables
pm2 env bims-api

# Restart
pm2 restart bims-api

# Delete and recreate
pm2 delete bims-api
pm2 start src/server.js --name "bims-api"
```

### Database Connection Issues
```bash
# Test connection
mysql -u bims_user -p bims_prod -e "SELECT 1;"

# Check MySQL status
systemctl status mysql

# Check ports
netstat -tlnp | grep 3306
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### High CPU/Memory Usage
```bash
# Monitor processes
top

# Kill process if needed
kill -9 PID

# Restart with PM2
pm2 restart bims-api
```

---

## Rollback Procedure

In case deployment issues:

```bash
# Check recent deployments
git log --oneline -10

# Rollback to previous version
git revert <commit-hash>
git push origin main

# Restart application
pm2 restart bims-api

# Restore database from backup
mysql -u root -p bims_prod < backup.sql
```

---

**Last Updated**: December 1, 2025
**Version**: 1.0.0
