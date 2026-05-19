import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, ShoppingBag } from 'lucide-react'
import useCartStore from '../../store/cartStore'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              Cloud<span className="text-blue-600">Commerce</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos, marcas y más..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/products" className="hover:text-blue-600 transition">
              Productos
            </Link>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <button className="p-2 rounded-full hover:bg-slate-100 transition">
              <User className="h-5 w-5 text-slate-600" />
            </button>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition">
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-3 border-t border-slate-100">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm outline-none"
                />
              </div>
            </form>
            <Link
              to="/products"
              className="block py-2 text-sm font-medium text-slate-600 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Productos
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
