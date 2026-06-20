import { QdrantClient } from '@qdrant/js-client-rest'

export type VectorHit = {
  cite: string
  score: number
  text: string
  source: string
  sourceName: string
  sourceType: string
  heading: string
  preview: string
  chunk: number
  wordCount: number
}

export function getQdrantClient(url: string) {
  return new QdrantClient({ url })
}

export async function ensureCollection(args: {
  client: QdrantClient
  collection: string
  vectorSize: number
}) {
  const { client, collection, vectorSize } = args
  const cols = await client.getCollections()
  const exists = cols.collections?.some((c) => c.name === collection)

  if (!exists) {
    await client.createCollection(collection, {
      vectors: { size: vectorSize, distance: 'Cosine' },
    })
  }
}

export async function upsertPoints(args: {
  client: QdrantClient
  collection: string
  points: Array<{
    id: string
    vector: number[]
    payload: Record<string, any>
  }>
}) {
  const { client, collection, points } = args
  await client.upsert(collection, { points })
}

export async function searchPoints(args: {
  client: QdrantClient
  collection: string
  vector: number[]
  topK: number
  scoreThreshold?: number
}) {
  const { client, collection, vector, topK, scoreThreshold } = args
  const res = await client.search(collection, {
    vector,
    limit: topK,
    with_payload: true,
    score_threshold: scoreThreshold,
  })

  return res.map((r, i) => ({
    cite: `[${i + 1}]`,
    score: r.score,
    text: (r.payload as any)?.text as string,
    source: (r.payload as any)?.source as string,
    sourceName: (r.payload as any)?.source_name as string,
    sourceType: (r.payload as any)?.source_type as string,
    heading: (r.payload as any)?.heading as string,
    preview: (r.payload as any)?.preview as string,
    chunk: (r.payload as any)?.chunk as number,
    wordCount: Number((r.payload as any)?.word_count ?? 0),
  })) satisfies VectorHit[]
}

export async function deletePointsBySource(args: {
  client: QdrantClient
  collection: string
  source: string
  sourceType?: string
}) {
  const { client, collection, source, sourceType } = args
  const must: Array<Record<string, any>> = [{ key: 'source', match: { value: source } }]

  if (sourceType) {
    must.push({ key: 'source_type', match: { value: sourceType } })
  }

  await client.delete(collection, {
    filter: { must },
  })
}
