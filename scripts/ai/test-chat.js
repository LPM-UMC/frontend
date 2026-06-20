import http from 'http';

const NUXT_CHAT_URL = 'http://localhost:3000/api/ai/chat-stream';

const payload = JSON.stringify({
  question: 'Syarat dokumen apa saja yang harus disiapkan untuk Form 01?',
  mode: 'chat'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/chat-stream',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    // Token bypass, yang akan dikenali sebagai ROLE: ADMIN
    'Authorization': 'Bearer admin-ai-chatbot'
  }
};

console.log('🤖 Mengirim pertanyaan ke AI...\n');
console.log('Pertanyaan:', JSON.parse(payload).question);
console.log('--------------------------------------------------');

const req = http.request(options, (res) => {
  res.on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });

  res.on('end', () => {
    console.log('\n\n✅ Selesai.');
  });
});

req.on('error', (e) => {
  console.error(`❌ Gagal: ${e.message}`);
});

req.write(payload);
req.end();
