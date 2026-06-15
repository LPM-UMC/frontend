// server/utils/clean-pdf-text.ts
export function cleanPdfText(raw: string) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/\u0000/g, '').trim())
    .filter(Boolean)

  const dropRegexes: RegExp[] = [
    /^UNIVERSITAS\s+MUHAMMADIYAH\s+CIREBON/i,
    /^Alamat:\s*/i,
    /^Website:\s*/i,
    /^Email:\s*/i,
    /^No Dokumen\s*/i,
    /^No Revisi\s*/i,
    /^Tgl berlaku\s*/i,
    /^Halaman\s+\d+/i,
    /^STANDAR\s+OPERASIONAL\s+PROSEDUR$/i,
    /^DAFTAR\s+ISI$/i,
    /^halaman$/i,
    /^--\s*\d+\s+of\s+\d+\s*--$/i,
  ]

  const kept = lines.filter((line) => {
    if (dropRegexes.some((rx) => rx.test(line))) return false
    // buang daftar isi yang penuh titik-titik
    if (/\.\.{8,}/.test(line)) return false
    return true
  })

  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}