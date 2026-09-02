# 🚀 PULSE — Quick Start Guide

## 5-Minute Setup

### Step 1: Prerequisites
```bash
# Make sure you have:
- Node.js 18+ (check: node --version)
- PostgreSQL 14+ (check: psql --version)
- npm (check: npm --version)
```

### Step 2: Clone & Install
```bash
cd pulse
npm install
```

### Step 3: Database Setup
```bash
# Start PostgreSQL (on your machine)
# Then create a new database:

psql -U postgres
CREATE DATABASE pulse_dev;
\q
```

### Step 4: Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pulse_dev"
BETTER_AUTH_SECRET="your-random-secret-key-at-least-32-characters"
ANTHROPIC_API_KEY="sk-ant-your-claude-api-key"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Step 5: Initialize Database
```bash
npm run prisma:migrate dev
```

### Step 6: Seed Demo Data
```bash
npm run seed
```

This creates:
- Demo user (demo@pulse.local / demo@123)
- Demo business (Coffee Shop)
- Sample data (customers, products, orders, etc.)

### Step 7: Start Development
```bash
npm run dev
```

Open **http://localhost:3000**

### Step 8: Login
```
Email: demo@pulse.local
Password: demo@123
```

---

## What You'll See

✅ **Dashboard** — Live metrics from demo data  
✅ **Customers** — 3 demo customers  
✅ **Products** — 3 demo products  
✅ **Orders** — 2 demo orders  
✅ **Expenses** — 3 demo expenses  
✅ **Tasks** — 3 demo tasks  
✅ **Analytics** — Real revenue/profit calculations  

---

## Common Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm start                # Run production build
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
npm run prisma:studio    # Open database UI (http://localhost:5555)
npm run seed             # Re-seed demo data
npm run prisma:migrate   # Create new migration
```

---

## Database Explorer

Open Prisma Studio to explore/edit data:
```bash
npm run prisma:studio
```

This opens a web UI to browse all tables and data.

---

## Testing the App

### Test User Registration
1. Go to http://localhost:3000/signup
2. Create new account
3. Fill onboarding
4. You'll land on a fresh dashboard

### Test Dashboard
1. Click through metrics
2. Check "Needs Your Attention" section
3. Click "Quick Actions"

### Test Customers
1. Go to Customers
2. Click "Add Customer"
3. Fill form and save
4. See customer in list

### Test Orders
1. Go to Orders
2. Click "New Order"
3. Select customer and products
4. Save and see in list

### Test Analytics
1. Go to Analytics
2. See revenue/profit calculations
3. Check profit margin

---

## Troubleshooting

### ❌ "Database connection failed"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists: `psql -l`

### ❌ "Module not found"
```bash
npm install
npm run prisma:generate
```

### ❌ "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### ❌ "Prisma migration error"
```bash
npm run prisma:migrate dev --name migration_name
```

---

## Next Steps

### Deploy to Production
See **DEPLOYMENT.md** for detailed instructions for:
- Vercel
- Railway
- Render
- AWS
- Docker

### Add More Features
- Customers: Advanced filtering, bulk import
- Reports: Custom date ranges, exports
- Automations: Scheduled tasks, webhooks
- Integrations: Stripe, Shopify, email services

### Customize
- Update colors in `tailwind.config.ts`
- Add your logo in `public/`
- Modify email templates
- Add custom fields to models

---

## Need Help?

1. Check **README.md** for architecture
2. Check **FINAL_BUILD_REPORT.md** for features
3. Explore Prisma Studio: `npm run prisma:studio`
4. Check inline code comments
5. Read error messages carefully!

---

**Ready? Let's go!** 🚀

```bash
npm run dev
```

Then visit: **http://localhost:3000**
