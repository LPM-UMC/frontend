import { defineEventHandler, getQuery, createError, sendRedirect } from 'h3'
import { minioClient, MINIO_BUCKET } from '../../utils/minio'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const source = query.source as string

  if (!source || !source.startsWith('ai-knowledge-bge/')) {
    throw createError({ statusCode: 400, statusMessage: 'Parameter source tidak valid' })
  }

  try {
    const filename = source.split('/').pop() || 'document.pdf'
    
    // Force browser to display inline as PDF instead of downloading
    const respHeaders = {
      'response-content-type': 'application/pdf',
      'response-content-disposition': `inline; filename="${filename}"`
    }

    const presignedUrl = await minioClient.presignedGetObject(MINIO_BUCKET, source, 60 * 60, respHeaders)
    return sendRedirect(event, presignedUrl)
  } catch (error: any) {
    console.error('Failed to generate presigned URL', error)
    throw createError({ statusCode: 500, statusMessage: 'Gagal memuat dokumen' })
  }
})
