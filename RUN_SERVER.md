# 🚀 How to Run Your Yoo Poopzz Eaglecraft Server

## Prerequisites
- Node.js installed (download from https://nodejs.org)
- Git (optional, for cloning the repo)

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Start the Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   🎮 YOO POOPZZ EAGLECRAFT SERVER 🎮   ║
╚════════════════════════════════════════╝

📡 Server Status: ONLINE ✅
🌐 Host: 0.0.0.0
🔌 Port: 3000
🔗 WebSocket: ws://0.0.0.0:3000
```

## Step 3: How Players Join

### From Same Computer (Local)
```
ws://localhost:3000
```

### From Different Computer (Local Network)
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Share: `ws://YOUR_IP:3000`

### From Internet (Public)
1. Set up domain pointing to your server: `wss://yoopoopzz.smp:3000`
2. Players connect with that URL

## API Endpoints

### Check Server Status
```bash
curl http://localhost:3000/api/status
```

### Get All Swords
```bash
curl http://localhost:3000/api/items/swords
```

### Get All Armor
```bash
curl http://localhost:3000/api/items/armor
```

## Troubleshooting

### "Port 3000 already in use"
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### "Connection refused"
- Make sure server is running
- Check firewall allows port 3000
- Use correct IP address

### "EADDRINUSE: address already in use"
Wait 30 seconds after stopping server, then restart

## Advanced

### Run in Development Mode (Auto-restart on changes)
```bash
npm run dev
```

### Change Port
```bash
PORT=8080 npm start
```

### Run in Background (Linux/Mac)
```bash
npm start > server.log 2>&1 &
```

## Server Features
✅ Real-time WebSocket communication
✅ Player join/leave notifications
✅ Chat system
✅ Custom items (Swords & Armor)
✅ RESTful API
✅ Automatic player tracking
