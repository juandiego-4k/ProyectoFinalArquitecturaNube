const express = require('express')
const cors = require('cors')
const products = require('./products')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'products' }))

app.get('/api/products', (req, res) => {
  const { category, q } = req.query
  let result = products
  if (category && category !== 'Todos') result = result.filter((p) => p.category === category)
  if (q) {
    const term = String(q).toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(term))
  }
  res.json(result)
})

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id)
  const product = products.find((p) => p.id === id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

const PORT = process.env.PORT || 3001

// ── Graceful Shutdown ──────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[products-service] listening on 0.0.0.0:${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('[products-service] SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('[products-service] server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('[products-service] SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('[products-service] server closed')
    process.exit(0)
  })
})
