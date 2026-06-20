// Script diagnostik untuk memicu RAG Ingest
import http from 'http';

const OLLAMA_URL = 'http://127.0.0.1:11434';
const QDRANT_URL = 'http://127.0.0.1:6333';
const NUXT_INGEST_URL = 'http://localhost:3000/api/ai/rag-ingest?force=true';

function ping(url, name) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true); // Asal merespons (meski 404), berarti aplikasinya hidup
    });
    req.on('error', () => resolve(false)); // Koneksi ditolak = mati
    req.end();
  });
}

function doIngest() {
  const urlObj = new URL(NUXT_INGEST_URL);
  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname + urlObj.search,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer admin-ai-chatbot'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\n✅ [NUXT] Ingest Berhasil!');
        console.log('Hasil:', JSON.parse(data));
      } else {
        console.log(`\n❌ [NUXT] Ingest Gagal! (Status: ${res.statusCode})`);
        try {
          console.log('Detail Error:', JSON.parse(data));
        } catch {
          console.log('Pesan Error Mentah:', data);
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error(`\n❌ [NUXT] Gagal terhubung ke server Nuxt: ${e.message}`);
    console.log('Pastikan terminal tempat Anda mengetik "npm run dev" sedang aktif.');
  });
  req.end();
}

async function start() {
  console.log('🔍 Menjalankan Diagnostik Pra-Ingest...\n');
  
  const ollamaOk = await ping(OLLAMA_URL, 'Ollama');
  console.log(`[OLLAMA] Server Database Vector (Port 11434): ${ollamaOk ? '🟢 HIDUP' : '🔴 MATI'}`);
  
  const qdrantOk = await ping(QDRANT_URL, 'Qdrant');
  console.log(`[QDRANT] Server Database Vector (Port 6333) : ${qdrantOk ? '🟢 HIDUP' : '🔴 MATI'}`);

  if (!ollamaOk || !qdrantOk) {
    console.log('\n⚠️ PROSES DIBATALKAN: Salah satu server mati. Pastikan Ollama dan Docker Qdrant Anda menyala terlebih dahulu!');
    return;
  }

  console.log('\nSemua sistem normal. ⏳ Memulai Ingest ke Server Nuxt...');
  doIngest();
}

start();
