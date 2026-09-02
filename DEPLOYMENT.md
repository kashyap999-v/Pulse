# 🚀 PULSE — Deployment Guide

## Choose Your Platform

### Option 1: Vercel (Recommended for Next.js)

**Easiest option. 5 minutes.**

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection)
   - `BETTER_AUTH_SECRET` (random string)
   - `ANTHROPIC_API_KEY` (Claude API key)
6. Click "Deploy"
7. Done! Your app is live

**Benefits:**
- Zero config
- Auto-deploys on git push
- Global CDN
- Serverless functions

---

### Option 2: Railway

**Simple and powerful.**

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Add Node.js environment
5. Connect GitHub repo
6. Set environment variables
7. Deploy

**Benefits:**
- Great dashboard
- Built-in database
- Easy to scale
- Affordable

---

### Option 3: Render

**Like Railway, very good.**

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Select Node.js environment
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

**Benefits:**
- Easy setup
- Good performance
- PostgreSQL included
- Auto-deploys

---

### Option 4: Docker + Cloud Run / App Runner

**For advanced users.**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t pulse:latest .
docker push your-registry/pulse:latest
```

Deploy to:
- Google Cloud Run
- AWS App Runner
- DigitalOcean App Platform

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Demo data seeded (or production data imported)
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Tested locally: `npm run dev`
- [ ] HTTPS configured
- [ ] Backups enabled
- [ ] Monitoring setup

---

## Environment Variables (Production)

```env
# Database (production PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/pulse_prod"

# Authentication
BETTER_AUTH_SECRET="generate-a-random-32-char-string"
BETTER_AUTH_URL="https://your-domain.com"

# AI
ANTHROPIC_API_KEY="sk-ant-your-api-key"

# Application
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"

# Optional
NEXT_PUBLIC_API_URL="https://your-domain.com"
```

Generate random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Setup (Production)

### Option 1: Managed PostgreSQL

**Recommended - No maintenance needed**

- Vercel Postgres
- Railway PostgreSQL
- Render PostgreSQL
- AWS RDS
- Google Cloud SQL
- DigitalOcean Managed Database

These all provide connection strings. Just paste into `DATABASE_URL`.

### Option 2: Self-Hosted

If hosting your own:

```bash
# Create production database
psql -U postgres
CREATE DATABASE pulse_prod;
CREATE USER pulse_user WITH PASSWORD 'strong-password';
ALTER ROLE pulse_user SET client_encoding TO 'utf8';
ALTER ROLE pulse_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pulse_user SET default_transaction_deferrable TO on;
ALTER ROLE pulse_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE pulse_prod TO pulse_user;
\q
```

Connection string:
```
postgresql://pulse_user:strong-password@localhost:5432/pulse_prod
```

---

## Run Migrations in Production

After deploying, run migrations:

```bash
# Via CLI (from your machine)
DATABASE_URL="your-prod-connection-string" npm run prisma:migrate deploy

# Or from production server
ssh your-server
cd /app/pulse
npm run prisma:migrate deploy
```

**Important:** Never run `migrate dev` in production. Use `migrate deploy`.

---

## Post-Deployment

### Monitor Your App

- Set up error tracking (Sentry, LogRocket)
- Enable performance monitoring
- Set up uptime checks
- Configure alerts

### Backup Strategy

- Enable automated daily backups
- Test restores regularly
- Keep backups for 30 days minimum
- Store backups in separate region

### Security

- Enable HTTPS (automatic on Vercel/Railway/Render)
- Set secure headers
- Configure CORS if needed
- Rotate secrets regularly
- Monitor for suspicious activity

### Scaling

When traffic grows:

- Database: Increase capacity
- Server: Add more instances
- Cache: Implement Redis if needed
- CDN: Ensure images optimized

---

## Rollback Plan

If something breaks:

```bash
# Revert to last working commit
git revert HEAD
git push

# This auto-deploys the working version
# Vercel/Railway will re-deploy automatically
```

---

## Performance Tips

```bash
# Optimize images
npm install next-image-optimization

# Enable compression
# Already built into Next.js

# Monitor performance
npm run build
# Check build output for large bundles

# Use Lighthouse
# https://lighthouse-metrics.com
```

---

## Costs Estimate

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel** | $0-20/mo | Great for small apps |
| **Railway** | $5-50/mo | Pay as you grow |
| **Render** | $7-50/mo | Good value |
| **AWS** | $20-200/mo | Most flexible |
| **DigitalOcean** | $5-40/mo | Simple pricing |

(Prices as of 2026)

---

## Deployment Checklist

```
[ ] Code pushed to GitHub
[ ] Environment variables set in platform
[ ] Database created and connected
[ ] Migrations run successfully
[ ] Build succeeds
[ ] App deployed and accessible
[ ] Login works
[ ] Dashboard loads
[ ] Sample data visible
[ ] Analytics calculating correctly
[ ] Backups enabled
[ ] Monitoring setup
[ ] Domain configured
[ ] HTTPS enabled
[ ] Team invited to admin panel
```

---

## Support URLs

- Vercel: https://vercel.com/docs
- Railway: https://railway.app/docs
- Render: https://render.com/docs
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs

---

**Choose your platform and deploy!** 🚀

Questions? Check the platform's documentation or ask your team.

**You've got this!** 💪
