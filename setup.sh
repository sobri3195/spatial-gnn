#!/bin/bash

# PathoST-GNN Setup Script
# This script helps you set up the project quickly

set -e

echo "┌─────────────────────────────────────────────────────────┐"
echo "│                                                         │"
echo "│  🧬 PathoST-GNN Setup                                   │"
echo "│                                                         │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION. Version 18+ is recommended."
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found"
    echo ""
    read -p "Would you like to create one now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo ""
        echo "📝 Please edit .env and add your Supabase credentials:"
        echo "   - VITE_SUPABASE_URL"
        echo "   - VITE_SUPABASE_PUBLISHABLE_KEY"
        echo ""
        echo "   Get these from: https://supabase.com/dashboard"
        echo "   → Project Settings → API"
        echo ""
        read -p "Press Enter to continue..."
    else
        echo "ℹ️  You can run in demo mode without Supabase configuration"
    fi
else
    echo "✅ .env file exists"
fi

echo ""
echo "┌─────────────────────────────────────────────────────────┐"
echo "│                                                         │"
echo "│  ✅ Setup Complete!                                     │"
echo "│                                                         │"
echo "│  Next steps:                                            │"
echo "│                                                         │"
echo "│  1. Start development server:                          │"
echo "│     npm run dev                                         │"
echo "│                                                         │"
echo "│  2. Open in browser:                                    │"
echo "│     http://localhost:8080                               │"
echo "│                                                         │"
echo "│  3. For production build:                               │"
echo "│     npm run build                                       │"
echo "│                                                         │"
echo "│  📖 Documentation:                                      │"
echo "│     - QUICKSTART.md                                     │"
echo "│     - NETLIFY_SETUP.md                                  │"
echo "│     - README.md                                         │"
echo "│                                                         │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

# Ask if user wants to start dev server
read -p "Would you like to start the development server now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting development server..."
    echo ""
    npm run dev
fi
