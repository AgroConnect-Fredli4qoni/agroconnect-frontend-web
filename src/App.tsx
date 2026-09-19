import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { AuthPage } from './pages/AuthPage'
import { OrdersPage } from './pages/OrdersPage'

/**
 * AppRoot wraps global providers, routing layers, and top-level navigation.
 *
 * @returns JSX Element presenting entire web application.
 */
export function AppRoot(): React.JSX.Element {
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app-layout">
            <Navbar onOpenAddProduct={() => setIsAddProductOpen(true)} />

            <main className="main-content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      isAddProductOpen={isAddProductOpen}
                      setIsAddProductOpen={setIsAddProductOpen}
                    />
                  }
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <footer className="footer">
              <div className="footer-content">
                <div className="footer-brand">
                  <span className="footer-logo">🌱</span>
                  <div>
                    <span className="footer-name">AgroConnect Platform</span>
                    <p className="footer-tagline">Solusi Agrikultur Cerdas & Rantai Pasok Hasil Tani Nusantara</p>
                  </div>
                </div>

                <div className="footer-meta">
                  <span>Standardisasi Kompetensi SKKNI Level 6 (BNSP)</span>
                  <span>Data Cuaca Terintegrasi Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</span>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoot
