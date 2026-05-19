import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Zap } from 'lucide-react'
import ProductCard from '../components/products/ProductCard'
import products, { categories } from '../data/products'

const CATEGORY_ICONS = { Electrónica: '📱', Deportes: '⚽', Hogar: '🏠' }

const features = [
  { icon: Truck, label: 'Envío a todo Colombia', desc: 'Gratis desde $200.000' },
  { icon: Shield, label: 'Compra 100% segura', desc: 'Datos protegidos siempre' },
  { icon: Zap, label: 'Entrega rápida', desc: 'En 24–48 horas hábiles' },
]

export default function Home() {
  const featured = products.slice(0, 8)
  const offers = products.filter((p) => p.originalPrice !== null).slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-blue-500/20 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-blue-400/20">
              🛍️ Más de 50.000 productos disponibles
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Tu tienda digital,{' '}
              <span className="text-blue-400">sin límites</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Encuentra los mejores productos de electrónica, deporte y hogar con envíos rápidos a
              toda Colombia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
              >
                Ver productos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products?badge=Oferta"
                className="inline-flex items-center justify-center gap-2 bg-blue-500/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-500/30 transition border border-blue-400/30"
              >
                Ver ofertas 🔥
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-64 h-64 bg-indigo-600 rounded-full opacity-10 translate-y-1/2 pointer-events-none" />
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Explora por categoría</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories
            .filter((c) => c !== 'Todos')
            .map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition group"
              >
                <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    {cat}
                  </p>
                  <p className="text-xs text-slate-500">
                    {products.filter((p) => p.category === cat).length} productos
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Offers */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🔥 Ofertas del día</h2>
              <p className="text-red-100 text-sm mt-1">Descuentos exclusivos por tiempo limitado</p>
            </div>
            <Link
              to="/products"
              className="text-white text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Productos destacados</h2>
          <Link
            to="/products"
            className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
