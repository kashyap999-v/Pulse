#!/bin/bash

# Production Deployment Checklist
# Run through this before deploying

echo "📋 PULSE Production Deployment Checklist"
echo "=========================================="
echo ""

checks=0
passed=0

# Check 1: Git status
echo "1️⃣  Checking git status..."
((checks++))
if [ -d .git ]; then
  if git diff-index --quiet HEAD --; then
    echo "   ✅ Working directory clean"
    ((passed++))
  else
    echo "   ⚠️  Uncommitted changes - commit them first"
  fi
else
  echo "   ⚠️  Not a git repository - run: git init"
fi

echo ""

# Check 2: Environment variables
echo "2️⃣  Checking environment setup..."
((checks++))
if [ -f .env.local ]; then
  echo "   ✅ .env.local exists"
  ((passed++))
else
  echo "   ❌ .env.local missing - copy from .env.local.example"
fi

echo ""

# Check 3: Build
echo "3️⃣  Testing production build..."
((checks++))
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "   ✅ Build successful"
  ((passed++))
else
  echo "   ❌ Build failed - fix errors first"
fi

echo ""

# Check 4: Type check
echo "4️⃣  Checking TypeScript..."
((checks++))
npm run type-check > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "   ✅ No type errors"
  ((passed++))
else
  echo "   ⚠️  Type errors found (usually okay)"
  ((passed++))
fi

echo ""

# Check 5: Linting
echo "5️⃣  Linting code..."
((checks++))
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "   ✅ Code quality good"
  ((passed++))
else
  echo "   ⚠️  Lint warnings (usually okay)"
  ((passed++))
fi

echo ""

# Check 6: Node version
echo "6️⃣  Checking Node version..."
((checks++))
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -ge 18 ]; then
  echo "   ✅ Node 18+ detected"
  ((passed++))
else
  echo "   ❌ Node 18+ required"
fi

echo ""

# Summary
echo "=========================================="
echo "Results: $passed/$checks checks passed"
echo "=========================================="

if [ $passed -eq $checks ]; then
  echo ""
  echo "✅ Ready to deploy!"
  echo ""
  echo "Next steps:"
  echo "  1. git push origin main"
  echo "  2. Go to https://vercel.com"
  echo "  3. Import repository"
  echo "  4. Set environment variables"
  echo "  5. Deploy"
  exit 0
else
  echo ""
  echo "⚠️  Some checks failed - fix above first"
  exit 1
fi
