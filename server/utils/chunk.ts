type MarkdownSection = {
  heading: string
  text: string
}

function normalizeChunkInput(raw: string) {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .split('\n')
    .map((line) => line.trim().replace(/[ \t]+/g, ' '))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function cleanChunkOutput(text: string) {
  return text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

function findSplitPoint(window: string, ideal: number, minSize: number) {
  const boundaries = ['\n\n', '. ', '? ', '! ', '; ', ': ', '\n', ', ', ' ']

  for (const boundary of boundaries) {
    const idx = window.lastIndexOf(boundary)
    if (idx >= minSize) return idx + boundary.length
  }

  for (let i = Math.min(window.length - 1, ideal); i >= minSize; i--) {
    const ch = window[i]
    if (ch === ' ' || ch === '\n') return i + 1
  }

  return Math.min(window.length, ideal)
}

export function chunkText(raw: string, maxChars = 1200, overlap = 180) {
  const text = normalizeChunkInput(raw)
  if (!text) return []

  const out: string[] = []
  let start = 0

  while (start < text.length) {
    const remaining = text.length - start
    if (remaining <= maxChars) {
      const tail = cleanChunkOutput(text.slice(start))
      if (tail) out.push(tail)
      break
    }

    const idealEnd = start + maxChars
    const searchEnd = Math.min(text.length, idealEnd + Math.floor(maxChars * 0.15))
    const window = text.slice(start, searchEnd)
    const minSize = Math.max(120, Math.floor(maxChars * 0.55))
    const splitPoint = findSplitPoint(window, maxChars, minSize)
    const end = Math.min(text.length, start + splitPoint)
    const part = cleanChunkOutput(text.slice(start, end))

    if (part && out[out.length - 1] !== part) out.push(part)

    let nextStart = Math.max(end - overlap, start + 1)
    if (nextStart <= start) nextStart = end

    while (nextStart < text.length && /\s/.test(text[nextStart]!)) nextStart++
    start = nextStart
  }

  return out
}

export function splitMarkdownSections(raw: string, fallbackHeading = 'Dokumen') {
  const normalized = raw.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const sections: MarkdownSection[] = []
  let heading = fallbackHeading
  let buffer: string[] = []

  function flush() {
    const text = cleanChunkOutput(buffer.join('\n'))
    if (!text) return
    sections.push({ heading, text })
    buffer = []
  }

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)$/)
    if (match) {
      flush()
      heading = match[2]?.trim() || fallbackHeading
      continue
    }

    buffer.push(line)
  }

  flush()

  if (!sections.length) {
    const text = cleanChunkOutput(normalized)
    return text ? [{ heading: fallbackHeading, text }] : []
  }

  return sections
}

export function createChunkPreview(text: string, maxChars = 180) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxChars) return normalized
  return `${normalized.slice(0, maxChars - 3).trim()}...`
}
