const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CLOUDFLARED = path.resolve(__dirname, 'cloudflared.exe');
const CONFIG_TS = path.resolve(__dirname, 'MOBILE', 'FashionSpace', 'config.ts');

function openTunnel(port, label) {
  return new Promise((resolve, reject) => {
    const proc = spawn(CLOUDFLARED, ['tunnel', '--url', `http://localhost:${port}`], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let resolved = false;
    const urlRegex = /https:\/\/[a-z0-9\-]+\.trycloudflare\.com/;

    const onData = (data) => {
      const text = data.toString();
      const match = text.match(urlRegex);
      if (match && !resolved) {
        resolved = true;
        console.log(`✅ ${label}: ${match[0]}`);
        resolve({ url: match[0], proc });
      }
    };

    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);

    proc.on('error', (err) => {
      if (!resolved) reject(new Error(`Erro ao iniciar cloudflared para ${label}: ${err.message}`));
    });

    // timeout de 30s
    setTimeout(() => {
      if (!resolved) reject(new Error(`Timeout ao abrir tunnel para ${label}`));
    }, 30000);
  });
}

function updateConfig(backendUrl) {
  if (!fs.existsSync(CONFIG_TS)) return;
  const content = fs.readFileSync(CONFIG_TS, 'utf8');
  const updated = content.replace(
    /export const TUNNEL_URL = '.*'/,
    `export const TUNNEL_URL = '${backendUrl}'`
  );
  fs.writeFileSync(CONFIG_TS, updated, 'utf8');
  console.log(`✅ config.ts atualizado: ${backendUrl}`);
}

async function main() {
  console.log('========================================');
  console.log(' Abrindo tunnels via Cloudflared');
  console.log(' Backend (8080) + Metro (8081)');
  console.log('========================================\n');

  if (!fs.existsSync(CLOUDFLARED)) {
    console.error(`❌ cloudflared.exe não encontrado em: ${CLOUDFLARED}`);
    process.exit(1);
  }

  let backendTunnel, metroTunnel;

  try {
    // Abre os dois tunnels em paralelo
    [backendTunnel, metroTunnel] = await Promise.all([
      openTunnel(8080, 'Backend'),
      openTunnel(8081, 'Metro  '),
    ]);
  } catch (e) {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  }

  updateConfig(backendTunnel.url);

  console.log('\n========================================');
  console.log(' Tunnels ativos!');
  console.log(` Backend : ${backendTunnel.url}`);
  console.log(` Metro   : ${metroTunnel.url}`);
  console.log('========================================');
  console.log('\nAgora rode em OUTRO terminal:');
  console.log('  cd MOBILE\\FashionSpace');
  console.log(`  EXPO_TUNNEL_SUBDOMAIN=ignore npx expo start --host tunnel --tunnel-url ${metroTunnel.url}`);
  console.log('\n  OU simplesmente:');
  console.log('  npx expo start');
  console.log(`  (e use o QR com a URL: ${metroTunnel.url})`);
  console.log('\nPressione Ctrl+C para encerrar os tunnels.\n');

  // Mantém o processo vivo e mata os tunnels ao sair
  process.on('SIGINT', () => {
    console.log('\nEncerrando tunnels...');
    backendTunnel.proc.kill();
    metroTunnel.proc.kill();
    process.exit(0);
  });

  // Mantém vivo
  setInterval(() => {}, 60000);
}

main();
