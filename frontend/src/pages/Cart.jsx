import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check, AlertTriangle } from 'lucide-react'
import useCartStore from '../store/cartStore'
import { formatPrice } from '../data/products'
import { submitCheckout } from '../api/client'

// User id de demo. En producción vendría de Cognito o de un sistema de auth.
const USER_ID = 'demo-user'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const shipping = total >= 200000 ? 0 : 15000

  const handleCheckout = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const result = await submitCheckout({
        userId: USER_ID,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      })
      setOrder(result)
      clearCart()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Compra confirmada!</h2>
        <p className="text-slate-500 mb-2">Número de orden:</p>
        <p className="font-mono text-lg font-semibold text-slate-900 mb-6">{order.orderId}</p>
        <p className="text-slate-600 mb-6">Total pagado: {formatPrice(order.total)}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Seguir comprando <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 mb-6">Agrega productos para comenzar tu compra.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Ver productos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Carrito ({count} {count === 1 ? 'producto' : 'productos'})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 hover:underline transition"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4">
              <Link to={`/products/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-50"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs text-blue-600 font-medium">{item.category}</span>
                    <Link to={`/products/${item.id}`}>
                      <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-200 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 hover:bg-slate-50 rounded-l-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-50 rounded-r-xl transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Resumen del pedido</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({count} productos)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-slate-400 italic">
                  Agrega {formatPrice(200000 - total)} más para envío gratis
                </p>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total + shipping)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              {submitting ? 'Procesando…' : 'Proceder al pago'}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
            {error && (
              <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Link
              to="/products"
              className="block text-center text-sm text-slate-500 hover:text-blue-600 mt-3 transition"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
