import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem(product, quantity = 1) {
        const { items } = get()
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity(id, quantity) {
        if (quantity < 1) return
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)) }))
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'cloudcommerce-cart' }
  )
)

export default useCartStore
