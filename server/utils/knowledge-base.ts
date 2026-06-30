import { minioClient, MINIO_BUCKET, KNOWLEDGE_PREFIX } from './minio'
import * as Minio from 'minio'

export type KnowledgeSourceType = 'doc' | 'pdf'

export type KnowledgeFile = {
  source: string
  sourceName: string
  sourceType: KnowledgeSourceType
  size: number
  lastModified: Date
  etag: string
}

export async function listKnowledgeFiles(): Promise<KnowledgeFile[]> {
  return new Promise((resolve, reject) => {
    const files: KnowledgeFile[] = []
    const stream = minioClient.listObjectsV2(MINIO_BUCKET, KNOWLEDGE_PREFIX, true)
    
    stream.on('data', (obj: Minio.BucketItem) => {
      if (!obj.name) return
      
      const fileName = obj.name.replace(KNOWLEDGE_PREFIX, '')
      if (!fileName || fileName.endsWith('/')) return

      const ext = fileName.split('.').pop()?.toLowerCase()
      let sourceType: KnowledgeSourceType = 'doc'
      if (ext === 'pdf') sourceType = 'pdf'
      else if (ext !== 'md' && ext !== 'txt') return // skip unknown

      files.push({
        source: obj.name,
        sourceName: fileName,
        sourceType,
        size: obj.size,
        lastModified: obj.lastModified,
        etag: obj.etag,
      })
    })

    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(files.sort((a, b) => a.source.localeCompare(b.source))))
  })
}
