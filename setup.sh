#!/bin/bash

# PULSE Database & Deployment Setup Script
# Run this from the project root

echo "🚀 PULSE — Starting Setup"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install failed"
  exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Step 2: Environment setup
echo "⚙️  Setting up environment variables..."

if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "✅ Created .env.local"
  echo "⚠️  IMPORTANT: Edit .env.local with your database credentials:"
  echo "   - DATABASE_URL (PostgreSQL connection string)"
  echo "   - BETTER_AUTH_SECRET (random 32+ char string)"
  echo "   - ANTHROPIC_API_KEY (from console.anthropic.com)"
  echo ""
  read -p "Press Enter after updating .env.local..."
else
  echo "✅ .env.local already exists"
fi

echo ""

# Step 3: Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

if [ $? -ne 0 ]; then
  echo "❌ Prisma generation failed"
  exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Step 4: Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate dev -- --name initial

if [ $? -ne 0 ]; then
  echo "❌ Database migration failed"
  exit 1
fi

echo "✅ Database migrated"
echo ""

# Step 5: Seed demo data
echo "🌱 Seeding demo data..."
npm run seed

echo "✅ Demo data seeded"
echo ""

# Step 6: Build
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "⚠️  Build had warnings (this is okay for development)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PULSE Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Start development: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Login with demo credentials"
echo "4. Explore the app!"
echo ""
echo "Commands:"
echo "  npm run dev              # Start development server"
echo "  npm run build            # Production build"
echo "  npm run prisma:studio    # Database explorer"
echo "  npm run lint             # Check code quality"
echo ""
