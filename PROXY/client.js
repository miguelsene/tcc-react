const http = require('http');
const { WebSocket } = require('ws');
const fs = require('fs');
const path = require('path');

// ⚠️ Após fazer deploy no Railway, cole a URL aqui
const RAILWAY_URL = process.env.RAILWAY_URL || 'https://SEU-PROJETO.up.railway.app';
const SECRET = 'fashionspace2025';
const CONFIG_TS = path.resolve(__dirname, '..', 'MOBILE', 'FashionSpace', 'config.ts');

const PORTS = [
  { port: 8080, label: 'Backend' },
  { port: 8081, label: 'Metro'   },
];

function updateConfig(railwayUrl) {
  if (!fs.existsSync(CONFIG_TS)) return;
  const updated = fs.readFileSync(CONFIG_TS, 'utf8').replace(
    /export const TUNNEL_URL = '.*'/,
    `export const TUNNEL_URL = '${railwayUrl}'`
  );
  fs.writeFileSync(CONFIG_TS, updated, 'utf8');
  console.log(`✅ config.ts atualizado: ${railwayUrl}`);
}

function forwardRequest(msg, port) {
  return new Promise((resolve) => {
    const body = Buffer.from(msg.body || '', 'base64');
    const headers = { ...msg.headers, host: `localhost:${port}` };
    delete headers['content-length'];
    if (body.length > 0) headers['content-length'] = body.length;

    const options = {
      hostname: 'localhost',
      port,
      path: msg.path,
      method: msg.method,
      headers,
    };

    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('base64'),
        });
      });
    });

    req.on('error', () => resolve({ status: 502, headers: {}, body: '' }));
    if (body.length > 0) req.write(body);
    req.end();
  });
}

function connectPort({ port, label }) {
  const wsUrl = RAILWAY_URL.replace('https://', 'wss://').replace('http://', 'ws://');
  const ws = new WebSocket(`${wsUrl}/?secret=${SECRET}&port=${port}`);

  ws.on('open', () => {
    console.log(`✅ ${label} (${port}) conectado ao Railway`);
  });

  ws.on('message', async (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type !== 'request') return;

    const result = await forwardRequest(msg, port);
    ws.send(JSON.stringify({ type: 'response', reqId: msg.reqId, ...result }));
  });

  ws.on('close', () => {
    console.log(`⚠️  ${label} desconectou, reconectando em 3s...`);
    setTimeout(() => connectPort({ port, label }), 3000);
  });

  ws.on('error', (e) => {
    console.error(`❌ ${label} erro: ${e.message}`);
  });
}

console.log('========================================');
console.log(' FashionSpace Proxy Client');
console.log(` Railway: ${RAILWAY_URL}`);
console.log('========================================\n');

updateConfig(RAILWAY_URL);
PORTS.forEach(connectPort);
