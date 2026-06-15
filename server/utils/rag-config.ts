export const DEFAULT_OLLAMA_BASE = 'http://127.0.0.1:11434'
export const DEFAULT_CHAT_MODEL = 'qwen2.5:3b-instruct'
export const DEFAULT_EMBED_MODEL = 'bge-m3'
export const DEFAULT_QDRANT_URL = 'http://127.0.0.1:6333'
export const DEFAULT_RAG_COLLECTION = 'lpm_sop_v2'
export const DEFAULT_RAG_CHUNK_SIZE = 1200
export const DEFAULT_RAG_CHUNK_OVERLAP = 180
export const DEFAULT_RAG_VECTOR_TOP_K = 8
export const DEFAULT_RAG_LEXICAL_TOP_K = 6
export const DEFAULT_RAG_HYBRID_TOP_K = 6
export const DEFAULT_RAG_VECTOR_SCORE_THRESHOLD = 0.25

export type RagConfig = {
  ollamaBase: string
  chatModel: string
  embedModel: string
  qdrantUrl: string
  collection: string
  chunkSize: number
  chunkOverlap: number
  vectorTopK: number
  lexicalTopK: number
  hybridTopK: number
  vectorScoreThreshold: number
}

function numberOrDefault(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function getRagConfig(): RagConfig {
  const config = useRuntimeConfig()

  return {
    ollamaBase: String(config.vllmBase || DEFAULT_OLLAMA_BASE),
    chatModel: String(config.vllmModel || DEFAULT_CHAT_MODEL),
    embedModel: String(config.embedModel || DEFAULT_EMBED_MODEL),
    qdrantUrl: String(config.qdrantUrl || DEFAULT_QDRANT_URL),
    collection: String(config.ragCollection || DEFAULT_RAG_COLLECTION),
    chunkSize: numberOrDefault(config.ragChunkSize, DEFAULT_RAG_CHUNK_SIZE),
    chunkOverlap: numberOrDefault(config.ragChunkOverlap, DEFAULT_RAG_CHUNK_OVERLAP),
    vectorTopK: numberOrDefault(config.ragVectorTopK, DEFAULT_RAG_VECTOR_TOP_K),
    lexicalTopK: numberOrDefault(config.ragLexicalTopK, DEFAULT_RAG_LEXICAL_TOP_K),
    hybridTopK: numberOrDefault(config.ragHybridTopK, DEFAULT_RAG_HYBRID_TOP_K),
    vectorScoreThreshold: numberOrDefault(
      config.ragVectorScoreThreshold,
      DEFAULT_RAG_VECTOR_SCORE_THRESHOLD
    ),
  }
}
