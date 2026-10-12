import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchUserProfile } from '../../services/api'
import { DashboardSidebar } from './DashboardSidebar'
import { FarmerProductsManager } from '../farmer/FarmerProductsManager'
import { SalesStatsDashboard } from './SalesStatsDashboard'
import { TransactionManager } from './TransactionManager'
import { FarmerWalletTab } from './FarmerWalletTab'
import { ProfileEditor } from './ProfileEditor'
import { AdminSidebar, AdminTabType } from '../admin/AdminSidebar'
import { AdminOverviewTab } from '../admin/AdminOverviewTab'
import { AdminUsersTab } from '../admin/AdminUsersTab'
import { AdminOrdersTab } from '../admin/AdminOrdersTab'
import { AdminCatalogTab } from '../admin/AdminCatalogTab'
import { AdminWithdrawalsTab } from '../admin/AdminWithdrawalsTab'
import { AdminHealthTab } from '../admin/AdminHealthTab'

/**
 * DashboardTab defines the available navigation views in regular user dashboard.
 */
export type DashboardTab = 'stats' | 'profile' | 'products' | 'transactions' | 'wallet'

/**
 * DashboardPage provides the authenticated layout hosting domain managers for farmers, buyers, and administrators.
 *
 * @returns JSX Element rendering the user or administrator dashboard.
 */
export function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, token, isAuthenticated, logout, updateUserSession } = useAuth()

  const isAdmin = user?.role === 'admin'

  const tabParam = searchParams.get('tab')
  const validAdminTabs: AdminTabType[] = ['overview', 'users', 'orders', 'catalog', 'withdrawals', 'health', 'profile']
  const validUserTabs: DashboardTab[] = ['stats', 'profile', 'products', 'transactions', 'wallet']

  const initialAdminTab: AdminTabType = tabParam && validAdminTabs.includes(tabParam as AdminTabType)
    ? (tabParam as AdminTabType)
    : 'overview'

  const initialUserTab: DashboardTab = tabParam && validUserTabs.includes(tabParam as DashboardTab)
    ? (tabParam as DashboardTab)
    : 'stats'

  const [activeAdminMenu, setActiveAdminMenu] = useState<AdminTabType>(initialAdminTab)
  const [activeUserMenu, setActiveUserMenu] = useState<DashboardTab>(initialUserTab)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (isAdmin) {
      if (tab && validAdminTabs.includes(tab as AdminTabType)) {
        setActiveAdminMenu(tab as AdminTabType)
      }
    } else {
      if (tab && validUserTabs.includes(tab as DashboardTab)) {
        setActiveUserMenu(tab as DashboardTab)
      }
    }
  }, [searchParams, isAdmin])

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

  if (isAdmin) {
    return (
      <div className="max-w-[1680px] mx-auto px-3.5 sm:px-8 lg:px-12 py-6 sm:py-8 pb-24 lg:pb-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <AdminSidebar
            user={user}
            activeMenu={activeAdminMenu}
            onSelectMenu={(menu) => {
              setActiveAdminMenu(menu)
              setSearchParams({ tab: menu })
            }}
            onLogout={logout}
          />

          <section className="flex-1 min-w-0 w-full space-y-6">
            {activeAdminMenu === 'overview' && <AdminOverviewTab />}
            {activeAdminMenu === 'users' && <AdminUsersTab />}
            {activeAdminMenu === 'orders' && <AdminOrdersTab />}
            {activeAdminMenu === 'catalog' && <AdminCatalogTab />}
            {activeAdminMenu === 'withdrawals' && <AdminWithdrawalsTab />}
            {activeAdminMenu === 'health' && <AdminHealthTab />}
            {activeAdminMenu === 'profile' && (
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

  return (
    <div className="max-w-[1680px] mx-auto px-3.5 sm:px-8 lg:px-12 py-6 sm:py-8 pb-24 lg:pb-8">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <DashboardSidebar
          user={user}
          activeMenu={activeUserMenu}
          onSelectMenu={(menu) => {
            const nextMenu = menu as DashboardTab
            setActiveUserMenu(nextMenu)
            setSearchParams({ tab: nextMenu })
          }}
          onLogout={logout}
        />

        <section className="flex-1 min-w-0 w-full space-y-6">
          {activeUserMenu === 'stats' && <SalesStatsDashboard />}
          {activeUserMenu === 'transactions' && <TransactionManager />}
          {activeUserMenu === 'wallet' && <FarmerWalletTab />}
          {activeUserMenu === 'products' && <FarmerProductsManager />}
          {activeUserMenu === 'profile' && (
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
