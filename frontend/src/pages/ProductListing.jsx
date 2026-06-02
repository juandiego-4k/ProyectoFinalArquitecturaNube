import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/products/ProductCard'
import { categories } from '../data/products'
import { useProducts } from '../hooks/useProducts'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
]

const MAX_PRICE = 7000000

export default function ProductListing() {
  const { products, loading, error } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('relevance')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)

  const activeCategory = searchParams.get('category') || 'Todos'
  const query = searchParams.get('q') || ''

  const filtered = useMemo(() => {
    let result = [...products]
    if (query) result = result.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    if (activeCategory !== 'Todos') result = result.filter((p) => p.category === activeCategory)
    result = result.filter((p) => p.price <= maxPrice)
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [activeCategory, query, sort, maxPrice, products])

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat === 'Todos') params.delete('category')
    else params.set('category', cat)
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {query
              ? `Resultados para "${query}"`
              : activeCategory === 'Todos'
              ? 'Todos los productos'
              : activeCategory}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} productos</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden flex items-center gap-2 text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-60 shrink-0`}>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Filtros</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="sm:hidden text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Categoría
              </p>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                      activeCategory === cat
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                    <span className="float-right text-slate-400 text-xs font-normal">
                      {cat === 'Todos'
                        ? products.length
                        : products.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Precio máximo
              </p>
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$0</span>
                <span>
                  {maxPrice >= MAX_PRICE ? 'Sin límite' : `$${(maxPrice / 1000000).toFixed(1)}M`}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <p className="text-lg font-semibold mb-2">Sin resultados</p>
              <p className="text-sm">Intenta con otros filtros o términos de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
