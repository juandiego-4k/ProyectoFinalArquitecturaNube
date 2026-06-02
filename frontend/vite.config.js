import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo local, los servicios corren en localhost:3001/3002/3003.
// En docker-compose se sobreescribe con variables de entorno.
const PRODUCTS_URL = process.env.VITE_PRODUCTS_URL || 'http://localhost:3001'
const CART_URL = process.env.VITE_CART_URL || 'http://localhost:3002'
const CHECKOUT_URL = process.env.VITE_CHECKOUT_URL || 'http://localhost:3003'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    proxy: {
      '/api/products': { target: PRODUCTS_URL, changeOrigin: true },
      '/api/cart': { target: CART_URL, changeOrigin: true },
      '/api/checkout': { target: CHECKOUT_URL, changeOrigin: true },
      '/api/orders': { target: CHECKOUT_URL, changeOrigin: true },
    },
  },
})
