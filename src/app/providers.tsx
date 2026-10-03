import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthContext'
import { CartProvider } from '../features/catalog/CartContext'

/**
 * AppProvidersProps specifies child components to wrap with global contexts.
 */
export interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * AppProviders consolidates global context providers including routing, authentication, and shopping cart.
 *
 * @param props - Children element tree.
 * @returns JSX Element rendering consolidated application providers.
 */
export function AppProviders(props: AppProvidersProps): React.JSX.Element {
  const { children } = props

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
