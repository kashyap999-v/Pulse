# PULSE Deployment to Vercel

## Steps to Deploy

### 1. Push to GitHub

```bash
cd pulse
git init
git add .
git commit -m "Initial PULSE commit - Production ready SaaS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pulse.git
git push -u origin main
```

### 2. Go to Vercel

- Visit https://vercel.com
- Click "New Project"
- Import from GitHub
- Select `pulse` repository

### 3. Configure Environment

In Vercel dashboard, set these environment variables:

```
DATABASE_URL = postgresql://...your-database-url...
BETTER_AUTH_SECRET = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ANTHROPIC_API_KEY = sk-ant-...your-claude-api-key...
NEXTAUTH_URL = https://your-app.vercel.app
NODE_ENV = production
```

### 4. Deploy

Click "Deploy"

Vercel will:
- Build the app
- Run migrations
- Deploy to CDN
- Give you live URL

Done! Your PULSE is live. ✅

## Post-Deployment

1. Visit your live URL
2. Test login/signup
3. Create test data
4. Share with friends

## To Seed Production Data

After deployment, run:
```bash
DATABASE_URL="your-prod-url" npm run seed
```

Or use Prisma Studio:
```bash
DATABASE_URL="your-prod-url" npm run prisma:studio
```

---

**You're live!** 🎉
