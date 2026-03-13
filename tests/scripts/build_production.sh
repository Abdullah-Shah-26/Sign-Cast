#!/bin/bash

# Production build script for SignCast (web frontend)

set -e

echo "🚀 Building SignCast for Production..."

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Build the frontend web app
echo "🎨 Building web frontend..."
cd apps/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Build the web app
echo "🔨 Building web app (Vite)..."
npm run build

echo "🎉 Production build complete!"
echo ""
echo "📦 Built web app location: apps/frontend/dist/"
echo "🔧 Deploy backend separately (FastAPI) and set VITE_BACKEND_URL accordingly."
echo ""
echo "✅ Ready to deploy as a web app!" 