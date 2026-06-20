import fs from 'node:fs'
import path from 'node:path'
import { createError, defineEventHandler, getQuery } from 'h3'
import { buildKnowledgeChunksForFile, listKnowledgeFiles } from '../../utils/knowledge-base'
import { embedWithOllama } from '../../utils/ollama-embed'
import { clearRagIndexCache } from '../../utils/rag'
import { getRagConfig } from '../../utils/rag-config'
import {
  deletePointsBySource,
  ensureCollection,
  getQdrantClient,
  upsertPoints,
} from '../../utils/qdrant'

type IngestStateEntry = {
  fingerprint: string
  chunkCount: number
  sourceType: string
  updatedAt: string
}

type IngestState = {
  version: number
  collection: string
  embedModel: string
  chunkSize: number
  chunkOverlap: number
  files: Record<string, IngestStateEntry>
}

const CACHE_DIR = path.resolve(process.cwd(), 'rag/.cache')
const STATE_FILE = path.join(CACHE_DIR, 'ingest-state.json')

function createEmptyState(config: ReturnType<typeof getRagConfig>): IngestState {
  return {
    version: 2,
    collection: config.collection,
    embedModel: config.embedModel,
    chunkSize: config.chunkSize,
    chunkOverlap: config.chunkOverlap,
    files: {},
  }
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

function loadState(config: ReturnType<typeof getRagConfig>) {
  if (!fs.existsSync(STATE_FILE)) return createEmptyState(config)

  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) as Partial<IngestState>
    if (!parsed || typeof parsed !== 'object') return createEmptyState(config)

    return {
      version: Number(parsed.version ?? 2),
      collection: String(parsed.collection ?? config.collection),
      embedModel: String(parsed.embedModel ?? config.embedModel),
      chunkSize: Number(parsed.chunkSize ?? config.chunkSize),
      chunkOverlap: Number(parsed.chunkOverlap ?? config.chunkOverlap),
      files: parsed.files ?? {},
    } satisfies IngestState
  } catch {
    return createEmptyState(config)
  }
}

function saveState(state: IngestState) {
  ensureCacheDir()
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
) {
  const results = new Array<R>(items.length)
  let cursor = 0
  const workerCount = Math.max(1, Math.min(concurrency, items.length || 1))

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (cursor < items.length) {
        const index = cursor++
        results[index] = await worker(items[index]!, index)
      }
    })
  )

  return results
}

export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event)
    const parsedLimit = q.limit ? Number(q.limit) : undefined
    const limitFiles = Number.isFinite(parsedLimit) ? parsedLimit : undefined
    const force = q.force === '1' || q.force === 'true'
    const partialMode = typeof limitFiles === 'number'

    const config = getRagConfig()
    const allFiles = listKnowledgeFiles()
    const files = partialMode ? allFiles.slice(0, limitFiles) : allFiles

    if (!files.length) {
      return {
        ok: true,
        partial_mode: partialMode,
        message: 'No knowledge files found in rag/docs or rag/pdfs',
      }
    }

    const client = getQdrantClient(config.qdrantUrl)
    const probe = await embedWithOllama({
      baseUrl: config.ollamaBase,
      model: config.embedModel,
      input: 'probe',
    })

    await ensureCollection({
      client,
      collection: config.collection,
      vectorSize: probe.length,
    })

    const previousState = partialMode ? createEmptyState(config) : loadState(config)
    const nextState = createEmptyState(config)
    const sameSettings =
      !partialMode &&
      previousState.collection === config.collection &&
      previousState.embedModel === config.embedModel &&
      previousState.chunkSize === config.chunkSize &&
      previousState.chunkOverlap === config.chunkOverlap

    const currentSources = new Set(files.map((file) => file.source))
    let removedSources = 0

    if (!partialMode && previousState.collection === config.collection) {
      for (const [source, stateEntry] of Object.entries(previousState.files)) {
        if (currentSources.has(source)) continue

        await deletePointsBySource({
          client,
          collection: config.collection,
          source,
          sourceType: stateEntry.sourceType,
        }).catch(() => {})

        removedSources++
      }
    }

    let ingestedFiles = 0
    let skippedCachedFiles = 0
    let skippedEmptyFiles = 0
    let ingestedChunks = 0
    const perFile: Array<Record<string, any>> = []

    for (const file of files) {
      const loaded = await buildKnowledgeChunksForFile(file, {
        chunkSize: config.chunkSize,
        chunkOverlap: config.chunkOverlap,
      })

      const cachedEntry = sameSettings ? previousState.files[file.source] : undefined
      const canReuseCache =
        !force && sameSettings && cachedEntry?.fingerprint === loaded.fingerprint

      if (canReuseCache && cachedEntry) {
        skippedCachedFiles++
        nextState.files[file.source] = cachedEntry
        perFile.push({
          source: file.source,
          source_type: file.sourceType,
          status: 'cached',
          chunk_count: cachedEntry.chunkCount,
        })
        continue
      }

      await deletePointsBySource({
        client,
        collection: config.collection,
        source: file.source,
        sourceType: file.sourceType,
      }).catch(() => {})

      if (!loaded.text.trim() || loaded.chunks.length === 0) {
        skippedEmptyFiles++
        perFile.push({
          source: file.source,
          source_type: file.sourceType,
          status: 'empty',
          text_len: loaded.text.length,
          chunk_count: 0,
        })
        continue
      }

      const vectors = await mapWithConcurrency(loaded.chunks, 2, (chunk) =>
        embedWithOllama({
          baseUrl: config.ollamaBase,
          model: config.embedModel,
          input: chunk.text,
        })
      )

      const points = loaded.chunks.map((chunk, index) => ({
        id: chunk.id,
        vector: vectors[index]!,
        payload: {
          text: chunk.text,
          source: chunk.source,
          source_name: chunk.sourceName,
          source_type: chunk.sourceType,
          heading: chunk.heading,
          chunk: chunk.chunk,
          preview: chunk.preview,
          word_count: chunk.wordCount,
          fingerprint: chunk.fingerprint,
        },
      }))

      await upsertPoints({
        client,
        collection: config.collection,
        points,
      })

      const stateEntry: IngestStateEntry = {
        fingerprint: loaded.fingerprint,
        chunkCount: loaded.chunks.length,
        sourceType: file.sourceType,
        updatedAt: new Date().toISOString(),
      }

      nextState.files[file.source] = stateEntry
      ingestedFiles++
      ingestedChunks += loaded.chunks.length

      perFile.push({
        source: file.source,
        source_type: file.sourceType,
        status: 'ingested',
        text_len: loaded.text.length,
        chunk_count: loaded.chunks.length,
        heading: loaded.heading,
      })
    }

    if (!partialMode) {
      saveState(nextState)
      
      // Hapus seluruh cache pertanyaan AI karena dokumen RAG telah diperbarui
      const storage = useStorage()
      const keys = await storage.getKeys('ai:chat')
      for (const key of keys) {
        await storage.removeItem(key)
      }
    }

    clearRagIndexCache()

    return {
      ok: true,
      collection: config.collection,
      partial_mode: partialMode,
      processed_files: files.length,
      ingested_files: ingestedFiles,
      ingested_chunks: ingestedChunks,
      skipped_cached_files: skippedCachedFiles,
      skipped_empty_files: skippedEmptyFiles,
      removed_sources: removedSources,
      perFile,
    }
  } catch (error: any) {
    console.error('Ingest Error Detail:', error)
    return {
      error: true,
      message: error?.message || String(error),
      stack: error?.stack
    }
  }
})
