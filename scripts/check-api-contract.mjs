#!/usr/bin/env node
/**
 * Check whether a FastAPI backend exposes the endpoints the frontend expects.
 *
 * Usage:
 *   npm run check:api
 *   API_BASE_URL=http://localhost:8000/api/v1 npm run check:api
 *   OPENAPI_URL=http://localhost:8000/openapi.json npm run check:api
 *
 * If the backend is not running, the script prints a warning and exits 0 so it
 * does not block mock-based frontend development.
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contract = JSON.parse(readFileSync(resolve(__dirname, 'contract.json'), 'utf8'))

const apiBase = process.env.API_BASE_URL || 'http://localhost:8000/api/v1'
const openapiUrl =
  process.env.OPENAPI_URL ||
  `${apiBase.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '')}/openapi.json`

function normalize(path) {
  return path.replace(/^\/api\/v\d+/, '')
}

function unique(values) {
  return [...new Set(values)]
}

console.log(`[check:api] OpenAPI: ${openapiUrl}`)

let spec
try {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  const response = await fetch(openapiUrl, { signal: controller.signal })
  clearTimeout(timeout)

  if (!response.ok) {
    console.warn(`[check:api] 后端返回 ${response.status}，跳过契约检查（Mock 开发不受影响）`)
    process.exit(0)
  }

  spec = await response.json()
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error)
  console.warn(`[check:api] 后端未就绪（${reason}），跳过契约检查（Mock 开发不受影响）`)
  process.exit(0)
}

const available = new Map()
for (const [path, methods] of Object.entries(spec.paths || {})) {
  const key = normalize(path)
  available.set(key, {
    fullPath: path,
    methods: new Set(Object.keys(methods).map((method) => method.toLowerCase())),
  })
}

const missing = []
let checked = 0

for (const [method, paths] of Object.entries(contract.required || {})) {
  for (const path of paths) {
    checked += 1
    const entry = available.get(path)
    if (!entry || !entry.methods.has(method.toLowerCase())) {
      missing.push(`${method} ${path}`)
    }
  }
}

if (missing.length) {
  console.error(`[check:api] 缺失 ${missing.length}/${checked} 个端点：`)
  for (const item of unique(missing)) console.error(`  - ${item}`)
  process.exit(1)
}

console.log(`[check:api] 通过：${checked} 个端点全部存在`)
