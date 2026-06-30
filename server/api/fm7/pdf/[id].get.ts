import puppeteer from 'puppeteer';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, message: 'Laporan ID is required' });
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
    const response = await $fetch<any>(`/api/fm7/${id}`, {
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
      <title>Laporan Akhir ${detailData.kode_laporan || id}</title>
      <style>
        @page { margin: 15mm; size: A4 portrait; }
        body {
          font-family: 'Times New Roman', Times, serif;
          color: black;
          line-height: 1.8;
          font-size: 14px;
        }
        .header { text-align: center; font-weight: bold; font-size: 18px; line-height: 1.4; margin-bottom: 20px; }
        .header p { margin: 5px 0; }
        .content { margin-top: 20px; font-size: 14px; text-align: justify; }
        h3 { font-size: 16px; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
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
      </style>
    </head>
    <body>
      <div class="header">
        <p>LAPORAN AKHIR MONITORING DAN EVALUASI</p>
        <p>PROGRAM STUDI ${detailData.program_studi.toUpperCase()}</p>
        <p>FAKULTAS ${detailData.fakultas.toUpperCase()}</p>
        <p>UNIVERSITAS MUHAMMADIYAH CIREBON</p>
      </div>

      <div class="content">
        <h3>KATA PENGANTAR</h3>
        <p>${(detailData.kata_pengantar || '').replace(/\\n/g, '<br>')}</p>

        <h3>BAB I PENDAHULUAN</h3>
        <h4>A. Latar Belakang</h4>
        <p>${(detailData.bab_1_latar_belakang || '').replace(/\\n/g, '<br>')}</p>
        
        <h4>B. Tujuan</h4>
        <p>${(detailData.bab_1_tujuan || '').replace(/\\n/g, '<br>')}</p>
        
        <h4>C. Dasar Hukum</h4>
        <p>${(detailData.bab_1_dasar_hukum || '').replace(/\\n/g, '<br>')}</p>

        <h3>BAB II HASIL MONEV</h3>
        <p>Data monitoring, evaluasi, dan survei terlampir.</p>

        <h3>BAB III RENCANA TINDAK LANJUT</h3>
        <p>Daftar temuan dan analisis risiko terlampir.</p>

        <h3>BAB IV SIMPULAN DAN REKOMENDASI</h3>
        <h4>A. Simpulan</h4>
        <p>${(detailData.bab_4_simpulan || '').replace(/\\n/g, '<br>')}</p>
        
        <h4>B. Rekomendasi</h4>
        <p>${(detailData.bab_4_rekomendasi || '').replace(/\\n/g, '<br>')}</p>
      </div>

      <div style="page-break-before: always;"></div>
      
      <div class="header">
        <p>HALAMAN PENGESAHAN</p>
      </div>

      <div class="signatures">
        ${(detailData.tanda_tangans || []).map((ttd: any) => {
          const verifyUrl = 'http://localhost:3000/verify/Laporan/' + detailData.id + '?ttd=' + ttd.id;
          const qrImgUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=95x95&data=' + encodeURIComponent(verifyUrl);
          const qrCodeHtml = ttd.status === 'DITANDATANGANI' 
            ? '<img src="' + qrImgUrl + '" alt="QR Code">' 
            : '<br><br><br>';
          
          return `
          <div class="signature-box">
            <div class="signature-title">
              <p>${ttd.role.nama}</p>
            </div>
            
            <div class="qr-placeholder">
              ${qrCodeHtml}
            </div>
            
            <p class="signature-name">${ttd.user?.nama || '(.............................................)'}</p>
          </div>
          `;
        }).join('')}
      </div>
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
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename="Laporan_Akhir_' + (detailData.kode_laporan || detailData.id) + '.pdf"');
    
    return pdfBuffer;

  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    throw createError({ statusCode: 500, message: error?.message || 'Failed to generate PDF' });
  }
});
