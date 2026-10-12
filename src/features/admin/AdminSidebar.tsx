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
 * AdminSidebar renders dedicated navigation control panel for platform administrators.
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-lg">
              <ShieldCheck size={26} />
            </div>
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              Super Admin
            </span>
            <h2 className="text-sm font-bold text-slate-100 truncate">{user.name}</h2>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        <div className="mt-4 pt-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-semibold text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar Akun Admin</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-xs text-slate-600 space-y-2">
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
