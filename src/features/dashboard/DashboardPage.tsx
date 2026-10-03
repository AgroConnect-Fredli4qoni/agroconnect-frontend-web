import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchUserProfile } from '../../services/api'
import { DashboardSidebar } from './DashboardSidebar'
import { FarmerProductsManager } from '../farmer/FarmerProductsManager'
import { SalesStatsDashboard } from './SalesStatsDashboard'
import { TransactionManager } from './TransactionManager'
import { ProfileEditor } from './ProfileEditor'

/**
 * DashboardPage provides the two-column authenticated dashboard layout hosting domain managers.
 *
 * @returns JSX Element rendering the user dashboard.
 */
export function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, token, isAuthenticated, logout, updateUserSession } = useAuth()

  const tabParam = searchParams.get('tab')
  const initialMenu = (tabParam && ['stats', 'profile', 'products', 'transactions'].includes(tabParam))
    ? (tabParam as 'stats' | 'profile' | 'products' | 'transactions')
    : 'stats'

  const [activeMenu, setActiveMenu] = useState<'stats' | 'profile' | 'products' | 'transactions'>(initialMenu)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['stats', 'profile', 'products', 'transactions'].includes(tab)) {
      setActiveMenu(tab as 'stats' | 'profile' | 'products' | 'transactions')
    }
  }, [searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } })
      return
    }

    if (token) {
      fetchUserProfile(token)
        .then((profile) => {
          updateUserSession(profile)
        })
        .catch(() => {})
    }
  }, [isAuthenticated, token])

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-10 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Autentikasi Diperlukan</h2>
          <p className="text-xs text-slate-500">Silakan masuk ke akun Anda untuk mengakses panel dashboard pengguna.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition-colors"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <DashboardSidebar
          user={user}
          activeMenu={activeMenu}
          onSelectMenu={(menu) => {
            const nextMenu = menu as 'stats' | 'profile' | 'products' | 'transactions'
            setActiveMenu(nextMenu)
            setSearchParams({ tab: nextMenu })
          }}
          onLogout={logout}
        />

        <section className="flex-1 min-w-0 w-full space-y-6">
          {activeMenu === 'stats' && <SalesStatsDashboard />}
          {activeMenu === 'transactions' && <TransactionManager />}
          {activeMenu === 'products' && <FarmerProductsManager />}
          {activeMenu === 'profile' && (
            <ProfileEditor
              user={user}
              token={token}
              onUpdateSuccess={(updatedUser, updatedToken) => updateUserSession(updatedUser, updatedToken)}
            />
          )}
        </section>
      </div>
    </div>
  )
}
