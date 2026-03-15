const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || 'fashionspace2025';

// Clientes PC conectados por porta
// { '8080': ws, '8081': ws }
const clients = {};

// Requisições HTTP aguardando resposta do PC
// { reqId: { res, timer } }
const pending = {};

let reqCounter = 0;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost`);

  // Rota de health check
  if (url.pathname === '/_health') {
    res.writeHead(200);
    return res.end('OK');
  }

  // Determina qual porta pelo path: /api/* → 8080, resto → 8081
  const targetPort = url.pathname.startsWith('/api') ? '8080' : '8081';
  const client = clients[targetPort];

  if (!client || client.readyState !== WebSocket.OPEN) {
    res.writeHead(502);
    return res.end(`PC não conectado na porta ${targetPort}`);
  }

  const reqId = String(++reqCounter);
  const chunks = [];

  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString('base64');

    // Envia requisição para o PC via WebSocket
    client.send(JSON.stringify({
      type: 'request',
      reqId,
      method: req.method,
      path: req.url,
      headers: req.headers,
      body,
    }));

    // Aguarda resposta por 30s
    const timer = setTimeout(() => {
      delete pending[reqId];
      res.writeHead(504);
      res.end('Timeout');
    }, 30000);

    pending[reqId] = { res, timer };
  });
});

// WebSocket para o cliente PC
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const secret = url.searchParams.get('secret');
  const port = url.searchParams.get('port');

  if (secret !== SECRET || !port) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  clients[port] = ws;
  console.log(`✅ PC conectado na porta ${port}`);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'response') {
        const p = pending[msg.reqId];
        if (!p) return;
        clearTimeout(p.timer);
        delete pending[msg.reqId];

        const body = Buffer.from(msg.body || '', 'base64');
        p.res.writeHead(msg.status, msg.headers || {});
        p.res.end(body);
      }
    } catch (e) {
      console.error('Erro ao processar mensagem:', e.message);
    }
  });

  ws.on('close', () => {
    console.log(`⚠️  PC desconectou da porta ${port}`);
    delete clients[port];
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Proxy rodando na porta ${PORT}`);
});
