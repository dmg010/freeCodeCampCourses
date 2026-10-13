import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
  const html = fs.readFileSync('./public/index.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

const wss = new WebSocketServer({ server });

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get("username");

  broadcast({ type: 'system', text: `${username} joined` });

  socket.on('message', (raw) => {
    const { username, text } = JSON.parse(raw);
    broadcast({ type: 'chat', username, text });
  });

  socket.on('close', () => {
    broadcast({ type: 'system', text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
