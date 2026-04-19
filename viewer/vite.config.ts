import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

const SKILLS_ROOT = path.resolve(__dirname, '..')

function skillsApiPlugin(): Plugin {
  return {
    name: 'skills-api',
    configureServer(server) {
      server.middlewares.use('/api/tree', (_req, res) => {
        const tree = buildTree(SKILLS_ROOT)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(tree))
      })

      server.middlewares.use('/api/file', (req, res) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        const filePath = url.searchParams.get('path')
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing path parameter' }))
          return
        }

        const fullPath = path.resolve(SKILLS_ROOT, filePath)
        if (!fullPath.startsWith(SKILLS_ROOT)) {
          res.statusCode = 403
          res.end(JSON.stringify({ error: 'Access denied' }))
          return
        }

        if (!fs.existsSync(fullPath)) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'File not found' }))
          return
        }

        const content = fs.readFileSync(fullPath, 'utf-8')
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ path: filePath, content }))
      })
    },
  }
}

interface TreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: TreeNode[]
}

function buildTree(rootDir: string, relativeTo = rootDir): TreeNode[] {
  const IGNORED = new Set([
    'node_modules', '.git', '__book_source', '__transcripts',
    'viewer', 'foundations', '.vscode', '.idea',
  ])
  const entries = fs.readdirSync(rootDir, { withFileTypes: true })
  const nodes: TreeNode[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.gitignore') continue
    if (entry.name.startsWith('__')) continue
    if (entry.name === 'CLAUDE.md') continue
    if (IGNORED.has(entry.name)) continue

    const fullPath = path.join(rootDir, entry.name)
    const relPath = path.relative(relativeTo, fullPath)

    if (entry.isDirectory()) {
      const children = buildTree(fullPath, relativeTo)
      if (children.length > 0) {
        nodes.push({ name: entry.name, path: relPath, type: 'directory', children })
      }
    } else if (entry.name.endsWith('.md')) {
      nodes.push({ name: entry.name, path: relPath, type: 'file' })
    }
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export default defineConfig({
  plugins: [react(), skillsApiPlugin()],
})
