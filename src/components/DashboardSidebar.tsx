import React from 'react'
import { User, LogOut, BadgeCheck, Sprout } from 'lucide-react'
import { UserProfile } from '../types/auth'

/**
 * DashboardSidebarProps defines the properties required by DashboardSidebar.
 */
export interface DashboardSidebarProps {
  user: UserProfile
  activeMenu: string
  onSelectMenu: (menu: string) => void
  onLogout: () => void
}

/**
 * DashboardSidebar renders the navigation sidebar for the authenticated user dashboard.
 *
 * @param props - Component configuration including user identity and logout handler.
 * @returns JSX Element rendering sidebar panel.
 */
export function DashboardSidebar(props: DashboardSidebarProps): React.JSX.Element {
  const { user, activeMenu, onSelectMenu, onLogout } = props

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-lg font-black shadow-2xs shrink-0">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-slate-900 truncate">{user.name}</h2>
          <div className="flex items-center gap-1 mt-0.5">
            <BadgeCheck size={12} className="text-emerald-600 shrink-0" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded truncate">
              {user.role === 'admin' ? 'Administrator' : user.role === 'farmer' ? 'Mitra Petani' : 'Pembeli'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu Utama
        </div>

        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectMenu('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeMenu === 'profile'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User size={16} />
            <span>Profil Pengguna</span>
          </button>

          {(user.role === 'farmer' || user.role === 'admin') && (
            <button
              type="button"
              onClick={() => onSelectMenu('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeMenu === 'products'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sprout size={16} />
              <span>Kelola Komoditas</span>
            </button>
          )}
        </nav>

        <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-left cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
