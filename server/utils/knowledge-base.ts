import fs from 'node:fs'
import path from 'node:path'
import { chunkText, createChunkPreview, splitMarkdownSections } from './chunk'
import { cleanPdfText } from './clean-pdf-text'
import { sha256Hex } from './hash'
import { extractTextFromPdf } from './pdf'
import { getRagConfig } from './rag-config'
import { stableUuid } from './stable-uuid'

export type KnowledgeSourceType = 'doc' | 'pdf'

export type KnowledgeFile = {
  absolutePath: string
  source: string
  sourceName: string
  sourceType: KnowledgeSourceType
  stat: fs.Stats
}

export type KnowledgeChunk = {
  id: string
  source: string
  sourceName: string
  sourceType: KnowledgeSourceType
  heading: string
  chunk: number
  text: string
  preview: string
  wordCount: number
  fingerprint: string
}

const DOC_DIR = path.resolve(process.cwd(), 'rag/docs')
const PDF_DIR = path.resolve(process.cwd(), 'rag/pdfs')

function toSourcePath(prefix: 'docs' | 'pdfs', fileName: string) {
  return path.posix.join(prefix, fileName)
}

function defaultHeadingFromName(sourceName: string) {
  return sourceName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length
}

function firstMarkdownHeading(text: string) {
  const match = text.match(/^\s*#{1,6}\s+(.*)$/m)
  return match?.[1]?.trim() || null
}

function collectFiles(args: {
  dir: string
  prefix: 'docs' | 'pdfs'
  sourceType: KnowledgeSourceType
  extensions: string[]
}) {
  const { dir, prefix, sourceType, extensions } = args
  if (!fs.existsSync(dir)) return [] as KnowledgeFile[]

  return fs
    .readdirSync(dir)
    .filter((fileName) => extensions.some((ext) => fileName.toLowerCase().endsWith(ext)))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const absolutePath = path.join(dir, fileName)
      return {
        absolutePath,
        source: toSourcePath(prefix, fileName),
        sourceName: fileName,
        sourceType,
        stat: fs.statSync(absolutePath),
      } satisfies KnowledgeFile
    })
}

export function listKnowledgeFiles() {
  return [
    ...collectFiles({
      dir: DOC_DIR,
      prefix: 'docs',
      sourceType: 'doc',
      extensions: ['.md', '.txt'],
    }),
    ...collectFiles({
      dir: PDF_DIR,
      prefix: 'pdfs',
      sourceType: 'pdf',
      extensions: ['.pdf'],
    }),
  ].sort((a, b) => a.source.localeCompare(b.source))
}

export async function readKnowledgeFile(file: KnowledgeFile) {
  const rawText =
    file.sourceType === 'pdf'
      ? await extractTextFromPdf(file.absolutePath)
      : fs.readFileSync(file.absolutePath, 'utf8')

  const text = file.sourceType === 'pdf' ? cleanPdfText(rawText) : rawText.trim()
  const heading = firstMarkdownHeading(text) || defaultHeadingFromName(file.sourceName) || 'Dokumen'
  const fingerprint = sha256Hex(
    JSON.stringify({
      source: file.source,
      size: file.stat.size,
      mtimeMs: Math.round(file.stat.mtimeMs),
      text,
    })
  )

  return {
    text,
    heading,
    fingerprint,
  }
}

export async function buildKnowledgeChunksForFile(
  file: KnowledgeFile,
  options?: { chunkSize?: number; chunkOverlap?: number }
) {
  const config = getRagConfig()
  const chunkSize = options?.chunkSize ?? config.chunkSize
  const chunkOverlap = options?.chunkOverlap ?? config.chunkOverlap
  const { text, heading, fingerprint } = await readKnowledgeFile(file)

  if (!text) {
    return {
      text,
      heading,
      fingerprint,
      chunks: [] as KnowledgeChunk[],
    }
  }

  const sections =
    file.sourceType === 'doc' ? splitMarkdownSections(text, heading) : [{ heading, text }]

  const chunks: KnowledgeChunk[] = []
  let chunkIndex = 0

  for (const section of sections) {
    const parts = chunkText(section.text, chunkSize, chunkOverlap)

    for (const part of parts) {
      chunks.push({
        id: stableUuid(`${file.source}:${section.heading}:${chunkIndex}:${part}`),
        source: file.source,
        sourceName: file.sourceName,
        sourceType: file.sourceType,
        heading: section.heading,
        chunk: chunkIndex,
        text: part,
        preview: createChunkPreview(part),
        wordCount: countWords(part),
        fingerprint,
      })
      chunkIndex++
    }
  }

  return {
    text,
    heading,
    fingerprint,
    chunks,
  }
}
