import fs from 'node:fs'

// penting: worker config dulu
import { CanvasFactory, getData } from 'pdf-parse/worker'
import { PDFParse } from 'pdf-parse'

// set worker eksplisit (menghindari worker gagal di framework)
PDFParse.setWorker(getData())

export async function extractTextFromPdf(filePath: string) {
  const buf = fs.readFileSync(filePath)

  const parser = new PDFParse({ data: buf, CanvasFactory })
  const result = await parser.getText()
  await parser.destroy?.()

  // bersihin karakter null kalau ada
  const text = (result.text ?? '').replace(/\u0000/g, '').trim()
  return text
}