// API client. Uses relative paths so it works in dev (Vite proxy),
// docker (nginx proxy_pass) and prod AWS (ALB path-based routing).
const handle = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.reason || `HTTP ${res.status}`)
  }
  return res.json()
}

// products-service
export const fetchProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetch(`/api/products${qs ? `?${qs}` : ''}`).then(handle)
}
export const fetchProduct = (id) => fetch(`/api/products/${id}`).then(handle)

// checkout-service
export const submitCheckout = (payload) =>
  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle)
