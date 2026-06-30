import { defineEventHandler } from 'h3'
import { listKnowledgeFiles } from '../../utils/knowledge-base'

export default defineEventHandler(async (event) => {
  try {
    const files = await listKnowledgeFiles()
    return {
      ok: true,
      data: files
    }
  } catch (error: any) {
    console.error('Failed to list knowledge files', error)
    return {
      ok: false,
      message: error.message || 'Gagal mengambil data'
    }
  }
})
