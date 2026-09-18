import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem } from '../types/order'
import { Product } from '../types/product'

/**
 * CartContextType defines shopping cart state and cart management operations.
 */
export interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * CartProvider wraps application tree with stateful cart management logic.
 *
 * @param props - Child React elements.
 * @returns JSX Element exposing shopping cart methods.
 */
export function CartProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('agro_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('agro_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity: number = 1): void => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id)
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock_kg)
        return prev.map((item) =>
          item.product_id === product.id ? { ...item, quantity: nextQty } : item,
        )
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          price: product.price_per_kg,
          quantity: Math.min(quantity, product.stock_kg),
          unit: product.unit,
          stock_available: product.stock_kg,
        },
      ]
    })
  }

  const removeItem = (productId: string): void => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock_available) }
          : item,
      ),
    )
  }

  const clearCart = (): void => {
    setItems([])
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/**
 * useCart hook provides consumer access to shopping cart properties and mutations.
 *
 * @returns CartContextType exposing state and mutators.
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be utilized within a CartProvider hierarchy')
  }
  return context
}
