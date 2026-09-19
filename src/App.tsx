import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { CartPage } from './pages/CartPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
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
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar onOpenAddProduct={() => setIsAddProductOpen(true)} />

            <main className="flex-1">
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-12">
              <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌱</span>
                  <div>
                    <span className="font-bold text-white text-sm block">AgroConnect Platform</span>
                    <p className="text-slate-400 text-xs mt-0.5">Solusi Agrikultur Cerdas & Rantai Pasok Hasil Tani Nusantara</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-1 text-slate-400">
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
