import React from 'react'
import {
  BarChart3,
  Users,
  ShoppingBag,
  Sprout,
  ArrowDownToLine,
  Activity,
  UserCheck,
  LogOut,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react'
import { UserProfile } from '../../types/auth'

/**
 * AdminTabType represents selectable navigation tabs in Admin Console.
 */
export type AdminTabType = 'overview' | 'users' | 'orders' | 'catalog' | 'withdrawals' | 'health' | 'profile'

/**
 * AdminSidebarProps defines configuration and event triggers for Admin Sidebar.
 */
export interface AdminSidebarProps {
  user: UserProfile
  activeMenu: AdminTabType
  onSelectMenu: (menu: AdminTabType) => void
  onLogout: () => void
}

/**
 * AdminSidebar renders dedicated navigation control panel for platform administrators in light aesthetic.
 *
 * @param props - User profile and navigation callback triggers.
 * @returns Rendered JSX element.
 */
export function AdminSidebar(props: AdminSidebarProps): React.JSX.Element {
  const { user, activeMenu, onSelectMenu, onLogout } = props

  const menuItems: { id: AdminTabType; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Ringkasan Eksekutif', icon: BarChart3 },
    { id: 'users', label: 'Manajemen Pengguna', icon: Users },
    { id: 'orders', label: 'Audit Transaksi Global', icon: ShoppingBag },
    { id: 'catalog', label: 'Moderasi Komoditas', icon: Sprout },
    { id: 'withdrawals', label: 'Pencairan Saldo Petani', icon: ArrowDownToLine },
    { id: 'health', label: 'Kesehatan Microservices', icon: Activity },
    { id: 'profile', label: 'Profil Administrator', icon: UserCheck },
  ]

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0 ring-2 ring-emerald-100">
            <ShieldCheck size={22} />
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold tracking-wider uppercase mb-0.5">
              Super Admin
            </span>
            <h2 className="text-sm font-bold text-slate-900 truncate">{user.name}</h2>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 mb-1.5">
            Menu Tata Kelola
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <LogOut size={16} />
            <span>Keluar Akun Admin</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-xs text-slate-600 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Operasional 24/7</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Platform AgroConnect berjalan pada arsitektur Polyrepo 7 Service terisolasi dengan verifikasi transaksi ACID & integrasi BMKG.
        </p>
      </div>
    </aside>
  )
}
