import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
              <span className="text-white font-bold text-lg">CloudCommerce</span>
            </div>
            <p className="text-sm leading-relaxed">
              Tu tienda digital de confianza. Compra seguro con envíos a todo Colombia.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electrónica" className="hover:text-white transition">
                  Electrónica
                </Link>
              </li>
              <li>
                <Link to="/products?category=Deportes" className="hover:text-white transition">
                  Deportes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hogar" className="hover:text-white transition">
                  Hogar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-white transition">Centro de ayuda</span></li>
              <li><span className="cursor-pointer hover:text-white transition">Política de devoluciones</span></li>
              <li><span className="cursor-pointer hover:text-white transition">Seguimiento de pedidos</span></li>
              <li><span className="cursor-pointer hover:text-white transition">Contáctanos</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-white transition">Sobre nosotros</span></li>
              <li><span className="cursor-pointer hover:text-white transition">Trabaja con nosotros</span></li>
              <li><span className="cursor-pointer hover:text-white transition">Términos y condiciones</span></li>
              <li><span className="cursor-pointer hover:text-white transition">Privacidad</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 CloudCommerce. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ para Colombia</p>
        </div>
      </div>
    </footer>
  )
}
