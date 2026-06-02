import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, Minus, Plus, Check } from 'lucide-react'
import { formatPrice } from '../data/products'
import ProductCard from '../components/products/ProductCard'
import useCartStore from '../store/cartStore'
import { useProduct, useProducts } from '../hooks/useProducts'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const { product, loading, error } = useProduct(id)
  const { products: all } = useProducts()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-500">Cargando…</div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-xl font-semibold text-slate-700">Producto no encontrado</p>
        <Link to="/products" className="text-blue-600 mt-4 inline-block hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const badgeColor =
    product.badge === 'Oferta'
      ? 'bg-red-100 text-red-600'
      : product.badge === 'Nuevo'
      ? 'bg-emerald-100 text-emerald-600'
      : 'bg-blue-100 text-blue-700'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          {product.badge && (
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${badgeColor}`}>
              {product.badge}
            </span>
          )}
          <span className="block text-sm text-blue-600 font-medium mb-2">{product.category}</span>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
            <span className="text-sm font-medium text-slate-700 ml-1">{product.rating}</span>
            <span className="text-sm text-slate-400">({product.reviews} reseñas)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-lg">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-700">Cantidad:</span>
            <div className="flex items-center border border-slate-200 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-2.5 hover:bg-slate-50 rounded-l-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="p-2.5 hover:bg-slate-50 rounded-r-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-slate-500">{product.stock} disponibles</span>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition ${
                added ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              {added ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
            <Link
              to="/cart"
              className="flex-1 flex items-center justify-center py-3.5 rounded-xl font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              Comprar ahora
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
              <Truck className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="text-xs text-slate-600">Envío gratis desde $200.000</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-slate-600">Compra 100% segura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
