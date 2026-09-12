import fs from 'node:fs'
import path from 'node:path'

const p = path.resolve('src/shared/data/mockVendors.ts')
let s = fs.readFileSync(p, 'utf8')

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const map = {}
s = s.replace(/id: '(\d+)',\s*\n\s*name: '([^']+)'/g, (_m, id, name) => {
  const sl = slug(name)
  map[id] = sl
  return `id: '${sl}',\n    name: '${name}'`
})

if (!s.includes('LEGACY_VENDOR_ID_MAP')) {
  s = s.replace(
    /\/\/ Helper function to filter vendors by category[\s\S]*$/,
    `/** Legacy numeric IDs from early demos → slug ids */
export const LEGACY_VENDOR_ID_MAP: Record<string, string> = ${JSON.stringify(map, null, 2)}

export function resolveVendorId(id: string | undefined): string | undefined {
  if (!id) return id
  return LEGACY_VENDOR_ID_MAP[id] || id
}

export const getVendorsByCategory = (categories: string[]): Vendor[] => {
  return mockVendors.filter((vendor) => categories.includes(vendor.category))
}

export const getAllCategories = (): string[] => {
  return Array.from(new Set(mockVendors.map((vendor) => vendor.category)))
}
`,
  )
}

fs.writeFileSync(p, s)
console.log('mapped', Object.keys(map).length)
