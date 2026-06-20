import crypto from 'node:crypto'

export function stableUuid(input: string) {
  const h = crypto.createHash('sha256').update(input).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
}