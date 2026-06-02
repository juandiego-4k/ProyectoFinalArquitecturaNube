const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Almacenamiento en memoria: { userId: [{ id, name, price, quantity, image }] }
// En AWS se reemplaza por DynamoDB (tabla: Cart, PK: userId).
const carts = new Map()

const getCart = (userId) => carts.get(userId) || []

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'cart' }))

app.get('/api/cart/:userId', (req, res) => {
  res.json({ userId: req.params.userId, items: getCart(req.params.userId) })
})

app.post('/api/cart/:userId/items', (req, res) => {
  const { id, name, price, image, category, quantity = 1 } = req.body
  if (!id || !name || price == null) {
    return res.status(400).json({ error: 'id, name, price are required' })
  }
  const items = getCart(req.params.userId)
  const existing = items.find((i) => i.id === id)
  if (existing) {
    existing.quantity += quantity
  } else {
    items.push({ id, name, price, image, category, quantity })
  }
  carts.set(req.params.userId, items)
  res.status(201).json({ userId: req.params.userId, items })
})

app.put('/api/cart/:userId/items/:id', (req, res) => {
  const { quantity } = req.body
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be a positive integer' })
  }
  const items = getCart(req.params.userId)
  const item = items.find((i) => i.id === Number(req.params.id))
  if (!item) return res.status(404).json({ error: 'Item not in cart' })
  item.quantity = quantity
  carts.set(req.params.userId, items)
  res.json({ userId: req.params.userId, items })
})

app.delete('/api/cart/:userId/items/:id', (req, res) => {
  const items = getCart(req.params.userId).filter((i) => i.id !== Number(req.params.id))
  carts.set(req.params.userId, items)
  res.json({ userId: req.params.userId, items })
})

app.delete('/api/cart/:userId', (req, res) => {
  carts.delete(req.params.userId)
  res.json({ userId: req.params.userId, items: [] })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`[cart-service] listening on :${PORT}`))
