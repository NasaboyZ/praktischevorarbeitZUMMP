import { WebSocketServer } from 'ws';
import http from 'http';
import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const ifaces of Object.values(interfaces)) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

const PORT = 3001;
const sessions = new Map(); // sessionId → { desktop: ws|null, mobile: ws|null, payload: any }

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/info') {
    const ip = getLocalIP();
    res.end(JSON.stringify({ ip, port: PORT, frontendPort: 5173 }));
  } else {
    res.statusCode = 404;
    res.end('{}');
  }
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  let sessionId = null;
  let role = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === 'register') {
      sessionId = msg.session;
      role = msg.role;
      if (!sessions.has(sessionId)) sessions.set(sessionId, { desktop: null, mobile: null, payload: null });
      const s = sessions.get(sessionId);
      s[role] = ws;

      if (role === 'mobile') {
        // Notify desktop that mobile connected
        if (s.desktop?.readyState === 1) {
          s.desktop.send(JSON.stringify({ type: 'mobile_connected', session: sessionId }));
        }
        // If payload already stored, send immediately
        if (s.payload) {
          ws.send(JSON.stringify({ type: 'data', payload: s.payload }));
        }
        ws.send(JSON.stringify({ type: 'registered', role: 'mobile', session: sessionId }));
      } else {
        ws.send(JSON.stringify({ type: 'registered', role: 'desktop', session: sessionId }));
      }
    }

    if (msg.type === 'send_data') {
      const s = sessions.get(sessionId);
      if (!s) return;
      s.payload = msg.payload;
      if (s.mobile?.readyState === 1) {
        s.mobile.send(JSON.stringify({ type: 'data', payload: msg.payload }));
      }
    }

    if (msg.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  });

  ws.on('close', () => {
    if (sessionId && sessions.has(sessionId)) {
      const s = sessions.get(sessionId);
      if (s[role] === ws) s[role] = null;
      if (!s.desktop && !s.mobile) {
        setTimeout(() => {
          if (!sessions.get(sessionId)?.desktop && !sessions.get(sessionId)?.mobile) {
            sessions.delete(sessionId);
          }
        }, 30000);
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  WebSocket server: ws://${getLocalIP()}:${PORT}`);
  console.log(`  Info endpoint:    http://${getLocalIP()}:${PORT}/api/info\n`);
});
