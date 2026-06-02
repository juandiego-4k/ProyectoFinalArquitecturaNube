// Helpers compartidos. La fuente de productos ahora es products-service via /api/products.
export const categories = ['Todos', 'Electrónica', 'Deportes', 'Hogar']

export const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price)
