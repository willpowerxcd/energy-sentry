#!/usr/bin/env node
/**
 * Create today's development log from the standard template.
 *
 * Usage:
 *   npm run log:new
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const logDir = resolve(root, 'docs/dev-log')
const now = new Date()
const pad = (value) => String(value).padStart(2, '0')
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
const file = resolve(logDir, `${date}.md`)

mkdirSync(logDir, { recursive: true })

if (existsSync(file)) {
  console.log(`[log:new] 今日日志已存在：${file}`)
  process.exit(0)
}

const template = `# ${date} 开发日志

- 所属阶段：
- 参与人：
- 耗时：

## 今日目标

- [ ]

## 完成内容

-

## 关键文件

-

## 截图 / 演示

-

## 问题与解决

-

## 明日计划

- [ ]

## 验证记录

- 命令：
- 结果：
`

writeFileSync(file, template, 'utf8')
console.log(`[log:new] 已创建：${file}`)
console.log('[log:new] 完成后请同步更新 docs/dev-log/index.md 与 CHANGELOG.md。')
