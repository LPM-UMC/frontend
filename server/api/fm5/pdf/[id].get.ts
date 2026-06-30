import puppeteer from 'puppeteer';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, message: 'Berita Acara ID is required' });
  }

  const query = getQuery(event);
  const token = (query.token as string) || getHeader(event, 'authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized, no token provided' });
  }

  const runtimeConfig = useRuntimeConfig();
  const apiBaseUrl = runtimeConfig.public.apiBaseUrl || 'http://localhost:3001';

  try {
    // 1. Fetch Data
    const response = await $fetch<any>(`/api/fm5/berita-acara/${id}`, {
      baseURL: apiBaseUrl,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const detailData = response.data;
    if (!detailData) {
      throw new Error('Data not found');
    }

    // 2. Construct Clean HTML
    const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Berita Acara ${detailData.nomor || id}</title>
      <style>
        @page { margin: 15mm; size: A4 portrait; }
        body {
          font-family: 'Times New Roman', Times, serif;
          color: black;
          line-height: 1.8;
          font-size: 16px;
        }
        .header { text-align: center; font-weight: bold; font-size: 20px; line-height: 1.4; margin-bottom: 40px; }
        .header p { margin: 5px 0; }
        .content { margin-top: 20px; font-size: 16px; }
        .signatures {
          margin-top: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px 20px;
          text-align: center;
        }
        .signature-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          min-height: 150px;
        }
        .signature-title { min-height: 50px; display: flex; flex-direction: column; justify-content: flex-end; }
        .signature-title p { margin: 2px 0; }
        .qr-placeholder { height: 95px; display: flex; align-items: center; justify-content: center; margin: 10px 0; }
        .signature-name { border-bottom: 1px solid black; padding: 0 10px; font-weight: bold; margin-top: auto; }
        .verification { margin-top: 60px; padding: 15px; border: 1px solid #ccc; border-radius: 8px; display: flex; align-items: center; gap: 15px; font-family: sans-serif; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <p>BERITA ACARA</p>
        <p style="text-transform: uppercase;">MONITORING DAN EVALUASI AWAL PEMBELAJARAN</p>
        <p>UNIVERSITAS MUHAMMADIYAH CIREBON</p>
      </div>

      <div class="content">
        <p>
          Pada hari ini <strong>${detailData.hari}</strong> tanggal <strong>${new Date(detailData.tanggalPelaksanaan).getDate()}</strong> bulan <strong>${detailData.bulan}</strong> tahun <strong>${detailData.tahun}</strong> Telah dilaksanakan monitoring dan evaluasi awal pembelajaran Semester <strong>${detailData.semester}</strong> pada Program Studi <strong>${detailData.programStudi}</strong>.
        </p>
        <p>Dengan hasil terlampir.</p>
        <p>Demikian berita acara ini dibuat sebagai bahan evaluasi pelaksanaan pembelajaran.</p>
      </div>

      <div class="signatures">
        ${detailData.tandaTangans.map((ttd: any) => `
          <div class="signature-box">
            <div class="signature-title">
              ${ttd.urutan === 2 ? `<p>Cirebon, ${new Date(detailData.tanggalPelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
              ${ttd.urutan === 3 ? `<p>Menyetujui,</p>` : ''}
              ${ttd.urutan === 4 ? `<p>Mengetahui,</p>` : ''}
              <p>${ttd.role.nama}</p>
            </div>
            
            <div class="qr-placeholder">
              ${ttd.status === 'DITANDATANGANI' 
                ? `<img src="https://api.qrserver.com/v1/create-qr-code/?size=95x95&data=${encodeURIComponent(`http://localhost:3000/verify/BeritaAcara/${detailData.id}?ttd=${ttd.id}`)}" alt="QR Code">` 
                : '<br><br><br>'}
            </div>
            
            <p class="signature-name">${ttd.user?.nama || '(.............................................)'}</p>
          </div>
        `).join('')}
      </div>

      ${detailData.dokumenTerverifikasi ? `
      <div class="verification">
        <div style="font-size: 30px;">✅</div>
        <div>
          <h4 style="margin: 0; font-weight: bold;">Dokumen Telah Terverifikasi</h4>
          <p style="margin: 5px 0 0 0; font-family: monospace; word-break: break-all;">Digital Signature: ${detailData.dokumenTerverifikasi.digitalSignature.substring(0, 40)}...</p>
        </div>
      </div>
      ` : ''}
    </body>
    </html>
    `;

    // 3. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
    });
    
    await browser.close();

    // 4. Return PDF Buffer
    setResponseHeader(event, 'Content-Type', 'application/pdf');
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename="Berita_Acara_' + (detailData.nomor || detailData.id) + '.pdf"');
    
    return pdfBuffer;

  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    throw createError({ statusCode: 500, message: error?.message || 'Failed to generate PDF' });
  }
});
