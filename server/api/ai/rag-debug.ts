import { defineEventHandler } from 'h3'
import { buildKnowledgeChunksForFile, listKnowledgeFiles } from '../../utils/knowledge-base'
import { embedWithOllama } from '../../utils/ollama-embed'
import { getQdrantClient, searchPoints } from '../../utils/qdrant'
import { buildRagIndex, retrieveRag } from '../../utils/rag'
import { getRagConfig } from '../../utils/rag-config'

export default defineEventHandler(async () => {
  const config = getRagConfig()
  const files = listKnowledgeFiles()
  const client = getQdrantClient(config.qdrantUrl)

  let sample: any = { found: false }
  if (files.length) {
    const first = files[0]
    const loaded = await buildKnowledgeChunksForFile(first)
    sample = {
      found: true,
      source: first.source,
      source_type: first.sourceType,
      text_len: loaded.text.length,
      heading: loaded.heading,
      chunk_count: loaded.chunks.length,
      preview: loaded.chunks[0]?.text.slice(0, 1200) ?? loaded.text.slice(0, 1200),
    }
  }

  let vectorHits: any[] = []
  let vectorError: string | null = null

  try {
    const qVec = await embedWithOllama({
      baseUrl: config.ollamaBase,
      model: config.embedModel,
      input: 'Form 01 monev pembelajaran',
    })

    vectorHits = await searchPoints({
      client,
      collection: config.collection,
      vector: qVec,
      topK: 3,
      scoreThreshold: config.vectorScoreThreshold,
    })
  } catch (error: any) {
    vectorError = error?.message || String(error)
  }

  const localIndex = await buildRagIndex()
  const lexicalHits = await retrieveRag('Form 01 monev pembelajaran', 3)

  return {
    ok: true,
    config: {
      collection: config.collection,
      embedModel: config.embedModel,
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
      vectorTopK: config.vectorTopK,
      lexicalTopK: config.lexicalTopK,
      hybridTopK: config.hybridTopK,
    },
    files: files.map((file) => ({
      source: file.source,
      source_type: file.sourceType,
      size: file.stat.size,
      mtimeMs: Math.round(file.stat.mtimeMs),
    })),
    sample,
    localIndex,
    vector: {
      hit_count: vectorHits.length,
      error: vectorError,
      hits: vectorHits,
    },
    lexical: {
      hit_count: lexicalHits.length,
      hits: lexicalHits,
    },
  }
})
