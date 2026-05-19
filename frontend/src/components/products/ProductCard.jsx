import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import { formatPrice } from '../../data/products'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const badgeColor =
    product.badge === 'Oferta'
      ? 'bg-red-500 text-white'
      : product.badge === 'Nuevo'
      ? 'bg-emerald-500 text-white'
      : 'bg-blue-600 text-white'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex flex-col">
      <Link
        to={`/products/${product.id}`}
        className="relative block overflow-hidden rounded-t-2xl bg-slate-50"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blue-600 font-medium mb-1">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-slate-700">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-semibold text-red-500">-{discount}%</span>
              </>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
