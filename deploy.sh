#!/bin/bash

# PULSE Production Deployment Script
# This prepares everything for production

echo "🚀 PULSE Production Deployment"
echo "================================"
echo ""

# Check Node version
echo "✓ Checking environment..."
node_version=$(node -v)
echo "  Node: $node_version"

npm_version=$(npm -v)
echo "  npm: $npm_version"

echo ""

# Build for production
echo "🏗️  Building for production..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build successful"
echo ""

# Type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
  echo "⚠️  Type errors found (non-blocking)"
fi

echo ""

# Lint
echo "📝 Running linter..."
npm run lint

echo ""

# Summary
echo "================================"
echo "✅ Production Build Ready!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to https://vercel.com"
echo "3. Import repository"
echo "4. Set environment variables"
echo "5. Click Deploy"
echo ""
echo "Your PULSE will be live in ~3 minutes!"
echo ""
