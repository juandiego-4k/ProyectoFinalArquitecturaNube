const express = require('express')
const cors = require('cors')
const crypto = require('crypto')

const app = express()
app.use(cors())
app.use(express.json())

// Órdenes en memoria. En AWS: DynamoDB (tabla: Orders, PK: orderId).
const orders = new Map()

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'checkout' }))

app.post('/api/checkout', (req, res) => {
  const { userId, items, shipping, payment } = req.body

  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'userId and non-empty items[] are required' })
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity || 1), 0)

  // Pago simulado: 90% éxito.
  const success = Math.random() < 0.9
  if (!success) {
    return res.status(402).json({ status: 'declined', reason: 'Payment declined (simulated)' })
  }

  const orderId = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
  const order = {
    orderId,
    userId,
    items,
    shipping: shipping || null,
    payment: payment ? { method: payment.method, last4: (payment.cardNumber || '').slice(-4) } : null,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
  orders.set(orderId, order)

  res.status(201).json(order)
})

app.get('/api/orders/:orderId', (req, res) => {
  const order = orders.get(req.params.orderId)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`[checkout-service] listening on :${PORT}`))
