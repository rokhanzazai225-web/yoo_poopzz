#!/bin/bash
# Eaglecraft Server Startup Script

echo "🚀 Starting Yoo Poopzz Eaglecraft Server..."

# Configuration
SERVER_IP="192.168.1.100"
SERVER_PORT="3000"
SERVER_DIR="$(pwd)"

echo "📍 Server IP: $SERVER_IP"
echo "🔌 Server Port: $SERVER_PORT"
echo "📁 Server Directory: $SERVER_DIR"

# Check if port is already in use
if lsof -i :$SERVER_PORT > /dev/null 2>&1; then
    echo "⚠️  Port $SERVER_PORT is already in use!"
    echo "Kill existing process? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        lsof -i :$SERVER_PORT | grep LISTEN | awk '{print $2}' | xargs kill -9
        echo "✅ Process killed"
    else
        echo "❌ Cannot start server. Port in use."
        exit 1
    fi
fi

# Start server (adjust based on your Eaglecraft setup)
echo "Starting server on ws://$SERVER_IP:$SERVER_PORT..."

# Option 1: If using Node.js server
# node server.js

# Option 2: If using Java server
# java -jar eaglecraft-server.jar

# Option 3: If using Python server
# python3 eaglecraft_server.py

# For testing, create a simple Node.js WebSocket server
if command -v node &> /dev/null; then
    echo "✅ Node.js detected. Starting test server..."
    npm start
else
    echo "❌ Node.js not found. Please install Node.js or manually start your server."
    exit 1
fi

echo "🎮 Server is running!"
echo "Connect to: ws://$SERVER_IP:$SERVER_PORT"
