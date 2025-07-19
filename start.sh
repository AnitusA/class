#!/bin/bash

echo "🚀 Starting Class Management System..."
echo "📍 Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please make sure you're in the class-management-system directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with your Supabase credentials"
    exit 1
fi

echo "✅ Environment configured!"
echo "🌐 Starting development server..."
echo "📱 Your application will be available at: http://localhost:3000"
echo ""
echo "Default login credentials:"
echo "👨‍🎓 Student: Registration Number = STU001, Password = admin123"
echo "👨‍💼 Admin: Passkey = admin123"
echo ""

npm run dev
