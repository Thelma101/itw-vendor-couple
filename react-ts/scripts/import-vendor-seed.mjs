/**
 * Import Lagos vendor seed CSV → JSON for backend / local seed.
 * Usage: node scripts/import-vendor-seed.mjs path/to/vendors.csv
 *
 * Does NOT scrape third-party sites (ToS / quality risk).
 * Fill the CSV from: Google Form responses, partner lists, or approved outreach exports.
 */
import fs from 'node:fs'
import path from 'node:path'

function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = splitCsvLine(lines[0])
  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = splitCsvLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h.trim()] = (cols[i] ?? '').trim()
    })
    return row
  })
}

function splitCsvLine(line) {
  const out = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"'
        i++
      } else inQ = !inQ
    } else if (c === ',' && !inQ) {
      out.push(cur)
      cur = ''
    } else cur += c
  }
  out.push(cur)
  return out
}

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/import-vendor-seed.mjs <vendors.csv>')
  process.exit(1)
}

const abs = path.resolve(input)
const rows = parseCsv(fs.readFileSync(abs, 'utf8'))
const vendors = rows
  .filter((r) => r.name && r.category)
  .map((r) => ({
    id: slugify(r.name),
    name: r.name,
    category: r.category,
    location: r.location || 'Lagos',
    price: Number(r.priceNaira) || 0,
    phone: r.phone || '',
    whatsapp: r.whatsapp || r.phone || '',
    instagram: r.instagram || '',
    email: r.email || '',
    bio: r.bio || '',
    city: 'Lagos',
    status: 'seed_pending_claim',
  }))

const outDir = path.resolve('scripts/output')
fs.mkdirSync(outDir, { recursive: true })
const outFile = path.join(outDir, 'vendor-seed.json')
fs.writeFileSync(outFile, JSON.stringify({ importedAt: new Date().toISOString(), count: vendors.length, vendors }, null, 2))
console.log(`Wrote ${vendors.length} vendors → ${outFile}`)
