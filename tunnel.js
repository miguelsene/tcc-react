const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CONFIG_TS = path.resolve(__dirname, 'MOBILE', 'FashionSpace', 'config.ts');

// Instala localtunnel se não tiver
try {
  require.resolve('localtunnel');
} catch {
  console.log('Instalando localtunnel...');
  execSync('npm install localtunnel --no-save', { stdio: 'inherit', cwd: __dirname });
}

const localtunnel = require('localtunnel');

async function openTunnel(port, label) {
  return new Promise(async (resolve, reject) => {
    let attempts = 0;
    const tryConnect = async () => {
      try {
        const tunnel = await localtunnel({ port });
        console.log(`✅ ${label}: ${tunnel.url}`);
        tunnel.on('close', () => {
          console.log(`⚠️  Tunnel ${label} fechou, reconectando...`);
          setTimeout(tryConnect, 2000);
        });
        tunnel.on('error', () => setTimeout(tryConnect, 2000));
        resolve(tunnel.url);
      } catch (e) {
        if (++attempts < 5) {
          setTimeout(tryConnect, 3000);
        } else {
          reject(new Error(`Falha ao abrir tunnel para ${label}`));
        }
      }
    };
    tryConnect();
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
  console.log(`✅ config.ts atualizado com: ${backendUrl}`);
}

async function main() {
  console.log('========================================');
  console.log(' Abrindo tunnels via localtunnel');
  console.log(' Backend (8080) + Metro (8081)');
  console.log('========================================\n');

  try {
    const [backendUrl, metroUrl] = await Promise.all([
      openTunnel(8080, 'Backend'),
      openTunnel(8081, 'Metro  '),
    ]);

    updateConfig(backendUrl);

    console.log('\n========================================');
    console.log(' Tunnels ativos!');
    console.log(` Backend : ${backendUrl}`);
    console.log(` Metro   : ${metroUrl}`);
    console.log('========================================');
    console.log('\nAgora rode em outro terminal:');
    console.log('  cd MOBILE\\FashionSpace');
    console.log('  npx expo start --tunnel');
    console.log('\nPressione Ctrl+C para encerrar os tunnels.\n');
  } catch (e) {
    console.error('Erro:', e.message);
    process.exit(1);
  }
}

main();
