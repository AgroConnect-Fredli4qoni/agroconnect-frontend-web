import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { BottomNav } from '../components/layout/BottomNav'
import { AppRoutes } from './routes'

/**
 * App renders the top-level application layout shell, coordinating headers, routes, footers, and mobile navigation.
 *
 * @returns JSX Element presenting root layout shell.
 */
export function App(): React.JSX.Element {
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {!isAuthPage && <Navbar onOpenAddProduct={() => setIsAddProductOpen(true)} />}

      <main className="flex-1">
        <AppRoutes
          isAddProductOpen={isAddProductOpen}
          setIsAddProductOpen={setIsAddProductOpen}
        />
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
    </div>
  )
}

export default App
