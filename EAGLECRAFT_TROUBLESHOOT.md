# Eaglecraft Server Troubleshooting Guide

## Handshake Timeout Fix

### 1. Check if Server is Running
```bash
# Check if process is listening on port 3000
netstat -an | grep 3000
# or
lsof -i :3000
```

### 2. Verify IP Address
- Your configured IP: `192.168.1.100`
- Find your actual IP:
```bash
# Linux/Mac
ifconfig

# Windows
ipconfig
```

### 3. Firewall Rules
```bash
# Allow port 3000 through firewall
# Windows (PowerShell as Admin):
netsh advfirewall firewall add rule name="Eaglecraft" dir=in action=allow protocol=tcp localport=3000

# Linux:
sudo ufw allow 3000/tcp
```

### 4. Test Connection
```bash
# From client machine, test if server is reachable:
curl -i http://192.168.1.100:3000

# Test WebSocket connection:
wscat -c ws://192.168.1.100:3000
```

### 5. Update Configuration if Needed
- Change IP to your actual server IP
- Ensure port 3000 is correct
- Use `localhost` or `127.0.0.1` if testing locally

### 6. Common Fixes
- **Restart the server process**
- **Check server logs** for errors
- **Use localhost if on same machine:** `ws://127.0.0.1:3000`
- **Disable VPN/Proxy** temporarily to test
- **Check antivirus** blocking connections
