import React from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { HomePage } from '../features/home/HomePage'
import { CatalogPage } from '../features/catalog/CatalogPage'
import { CartPage } from '../features/catalog/CartPage'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { OrdersPage } from '../features/orders/OrdersPage'
import { FarmerProfilePage } from '../features/farmer/FarmerProfilePage'
import { DashboardPage } from '../features/dashboard/DashboardPage'

/**
 * FarmerRouteRedirect handles legacy /farmer/:slug redirects to the canonical /petani/:slug path.
 *
 * @returns JSX Element performing navigation redirect.
 */
export function FarmerRouteRedirect(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/petani/${slug || ''}`} replace />
}

/**
 * AppRoutesProps specifies callback controllers passed to routed view modules.
 */
export interface AppRoutesProps {
  isAddProductOpen: boolean
  setIsAddProductOpen: (open: boolean) => void
}

/**
 * AppRoutes provides the centralized declarative route declarations for the entire application.
 *
 * @param props - Modal controller state and callback.
 * @returns JSX Element presenting active application route.
 */
export function AppRoutes(props: AppRoutesProps): React.JSX.Element {
  const { isAddProductOpen, setIsAddProductOpen } = props

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/catalog"
        element={
          <CatalogPage
            isAddProductOpen={isAddProductOpen}
            setIsAddProductOpen={setIsAddProductOpen}
          />
        }
      />
      <Route path="/katalog" element={<Navigate to="/catalog" replace />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
      <Route path="/profil" element={<Navigate to="/dashboard" replace />} />
      <Route path="/petani/:slug" element={<FarmerProfilePage />} />
      <Route path="/farmer/:slug" element={<FarmerRouteRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
