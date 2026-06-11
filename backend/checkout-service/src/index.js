const express = require('express')
const cors = require('cors')
const crypto = require('crypto')

// 1. Importamos el SDK de AWS
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')

const app = express()
app.use(cors())
app.use(express.json())

// 2. Configuramos el cliente de DynamoDB. 
// No necesitamos poner contraseñas aquí porque AWS Fargate usará el "TaskRole" que le asignaste en CloudFormation.
const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

// Tomamos el nombre de la tabla que CloudFormation nos inyectó, o usamos un valor por defecto.
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'cloudcommerce-Orders'

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'checkout' }))

// 3. Convertimos la ruta en 'async' para poder esperar la respuesta de AWS
app.post('/api/checkout', async (req, res) => {
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
    orderId, // Esta es la llave principal (PK) en DynamoDB
    userId,
    items,
    shipping: shipping || null,
    payment: payment ? { method: payment.method, last4: (payment.cardNumber || '').slice(-4) } : null,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  try {
    // 4. Guardamos la orden real en DynamoDB usando PutCommand
    await docClient.send(new PutCommand({
      TableName: ORDERS_TABLE,
      Item: order
    }))
    
    console.log(`[checkout-service] Orden ${orderId} guardada en DynamoDB exitosamente.`);
    res.status(201).json(order)

  } catch (error) {
    console.error('[checkout-service] Error guardando en DynamoDB:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la orden' })
  }
})

// 5. Actualizamos el método GET para buscar en DynamoDB
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const response = await docClient.send(new GetCommand({
      TableName: ORDERS_TABLE,
      Key: { orderId: req.params.orderId }
    }))

    if (!response.Item) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(response.Item)
  } catch (error) {
    console.error('[checkout-service] Error buscando en DynamoDB:', error);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

const PORT = process.env.PORT || 3003

// ── Graceful Shutdown ──────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[checkout-service] listening on 0.0.0.0:${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('[checkout-service] SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('[checkout-service] server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('[checkout-service] SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('[checkout-service] server closed')
    process.exit(0)
  })
})