import { defineEventHandler } from 'h3'
import { buildRagIndex } from '../../utils/rag'

export default defineEventHandler(async () => {
  const info = await buildRagIndex({ force: true })
  return { ok: true, ...info }
})
