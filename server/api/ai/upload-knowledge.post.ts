import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { minioClient, MINIO_BUCKET, KNOWLEDGE_PREFIX, ensureBucket } from '../../utils/minio'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const fileInfo = formData.find((item) => item.name === 'file')
  if (!fileInfo || !fileInfo.data) {
    throw createError({ statusCode: 400, statusMessage: 'File field is missing' })
  }

  const filename = fileInfo.filename || 'unknown.pdf'
  if (!filename.toLowerCase().endsWith('.pdf')) {
    throw createError({ statusCode: 400, statusMessage: 'Hanya menerima file PDF' })
  }

  await ensureBucket()

  const objectKey = `${KNOWLEDGE_PREFIX}${filename}`
  
  try {
    await minioClient.putObject(MINIO_BUCKET, objectKey, fileInfo.data)
    return {
      ok: true,
      message: `File ${filename} berhasil diunggah ke Knowledge Base.`,
      filename,
    }
  } catch (error: any) {
    console.error('Failed to upload to MinIO', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal menyimpan file ke penyimpanan.',
    })
  }
})
