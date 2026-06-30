import * as Minio from 'minio'

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'si-imoet-umc'
export const KNOWLEDGE_PREFIX = 'ai-knowledge-bge/pdfs/'

export async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET)
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET)
    }
  } catch (error) {
    console.error('[MinIO] Failed to ensure bucket:', error)
  }
}
