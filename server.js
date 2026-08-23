const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const SERVER_NAME = 'Yoo Poopzz SMP';

// Middleware
app.use(cors());
app.use(express.json());

// Load game data
const loadGameData = () => {
  const data = {
    swords: [],
    armor: [],
    smp: {}
  };

  try {
    if (fs.existsSync(path.join(__dirname, 'swords.json'))) {
      data.swords = JSON.parse(fs.readFileSync(path.join(__dirname, 'swords.json'), 'utf8')).specialSwords;
    }
  } catch (e) {
    console.warn('⚠️  Could not load swords.json');
  }

  try {
    if (fs.existsSync(path.join(__dirname, 'armor.json'))) {
      data.armor = JSON.parse(fs.readFileSync(path.join(__dirname, 'armor.json'), 'utf8')).specialArmor;
    }
  } catch (e) {
    console.warn('⚠️  Could not load armor.json');
  }

  return data;
};

const gameData = loadGameData();
const connectedPlayers = new Set();

// REST API Routes
app.get('/', (req, res) => {
  res.json({
    server: SERVER_NAME,
    status: 'online',
    players: connectedPlayers.size,
    websocket: `ws://0.0.0.0:${PORT}`,
    version: '1.0.0'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: SERVER_NAME,
    status: 'online',
    players: Array.from(connectedPlayers),
    playerCount: connectedPlayers.size,
    items: {
      swords: gameData.swords.length,
      armor: gameData.armor.length
    }
  });
});

app.get('/api/items/swords', (req, res) => {
  res.json({ swords: gameData.swords });
});

app.get('/api/items/armor', (req, res) => {
  res.json({ armor: gameData.armor });
});

// WebSocket Connection Handler
wss.on('connection', (ws, req) => {
  const clientId = Math.random().toString(36).substring(7);
  connectedPlayers.add(clientId);

  console.log(`✅ Player connected: ${clientId} (Total: ${connectedPlayers.size})`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: `Welcome to ${SERVER_NAME}!`,
    clientId: clientId,
    playerCount: connectedPlayers.size,
    items: gameData
  }));

  // Broadcast player joined
  broadcastToAll({
    type: 'playerJoined',
    clientId: clientId,
    playerCount: connectedPlayers.size
  });

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'chat':
          broadcastToAll({
            type: 'chat',
            sender: clientId,
            message: message.text,
            timestamp: new Date()
          });
          break;

        case 'playerAction':
          broadcastToAll({
            type: 'playerAction',
            clientId: clientId,
            action: message.action,
            data: message.data
          });
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;

        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (e) {
      console.error('Error processing message:', e);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  // Handle disconnect
  ws.on('close', () => {
    connectedPlayers.delete(clientId);
    console.log(`❌ Player disconnected: ${clientId} (Total: ${connectedPlayers.size})`);

    broadcastToAll({
      type: 'playerLeft',
      clientId: clientId,
      playerCount: connectedPlayers.size
    });
  });

  ws.on('error', (error) => {
    console.error(`Error with player ${clientId}:`, error);
  });
});

// Helper function to broadcast to all connected clients
function broadcastToAll(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Start server
server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎮 YOO POOPZZ EAGLECRAFT SERVER 🎮   ║
╚════════════════════════════════════════╝

📡 Server Status: ONLINE ✅
🌐 Host: ${HOST}
🔌 Port: ${PORT}
🔗 WebSocket: ws://0.0.0.0:${PORT}
🎯 Connection URL: ws://yoopoopzz.smp:${PORT}

📊 Players Online: ${connectedPlayers.size}
⚔️  Special Swords: ${gameData.swords.length}
🛡️  Special Armor: ${gameData.armor.length}

Ready to accept connections!
Type Ctrl+C to stop the server.
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
