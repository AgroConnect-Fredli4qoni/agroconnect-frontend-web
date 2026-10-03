import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  X,
  Home,
  Store,
  ShoppingCart,
  ClipboardList,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sprout,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * MobileSidebarProps defines visibility controllers for the off-canvas navigation drawer.
 */
export interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * MobileSidebar renders a touch-friendly off-canvas drawer sliding from the left for mobile and tablet viewports.
 *
 * @param props - Visibility state and dismissal callback.
 * @returns JSX Element presenting mobile navigation sidebar.
 */
export function MobileSidebar(props: MobileSidebarProps): React.JSX.Element | null {
  const { isOpen, onClose } = props
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()

  useEffect(() => {
    onClose()
  }, [location.pathname])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isRoleFarmer = user?.role === 'farmer'
  const isRoleAdmin = user?.role === 'admin'

  const roleLabel = isRoleFarmer
    ? 'Petani Terverifikasi'
    : isRoleAdmin
      ? 'Administrator'
      : 'Pembeli Terverifikasi'

  const primaryNavLinks = [
    {
      to: '/',
      label: 'Beranda',
      icon: Home,
      active: location.pathname === '/',
    },
    {
      to: '/catalog',
      label: 'Kategori & Produk',
      icon: Store,
      active: location.pathname.startsWith('/catalog') || location.pathname.startsWith('/katalog'),
    },
    {
      to: '/cart',
      label: 'Keranjang',
      icon: ShoppingCart,
      active: location.pathname === '/cart',
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      to: isAuthenticated ? '/orders' : '/login',
      label: 'Pesanan Saya',
      icon: ClipboardList,
      active: location.pathname === '/orders',
    },
  ]

  const secondaryNavLinks = [
    {
      to: isAuthenticated ? '/dashboard' : '/login',
      label: 'Alamat Saya',
      icon: MapPin,
      active: false,
    },
    {
      to: isAuthenticated ? '/dashboard' : '/login',
      label: 'Metode Pembayaran',
      icon: CreditCard,
      active: false,
    },
    {
      to: isAuthenticated ? '/dashboard' : '/login',
      label: 'Notifikasi',
      icon: Bell,
      active: false,
    },
    {
      to: '/catalog',
      label: 'Bantuan & Pusat Informasi',
      icon: HelpCircle,
      active: false,
    },
    {
      to: isAuthenticated ? '/dashboard' : '/login',
      label: 'Pengaturan',
      icon: Settings,
      active: location.pathname === '/dashboard',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-250">
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/images/logo/logo.png"
                alt="AgroConnect"
                className="w-8 h-8 object-contain shrink-0"
              />
              <div>
                <span className="text-base font-black text-emerald-950 tracking-tight block leading-tight">
                  AgroConnect
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Smart Agro-Commerce</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-slate-100">
            {isAuthenticated && user ? (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-100/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-2xs overflow-hidden shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1">
                      {isRoleFarmer ? <Sprout size={11} /> : <ShieldCheck size={11} />}
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between text-xs">
                  <Link
                    to="/dashboard"
                    className="font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Buka Panel Dashboard</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-2.5">
                <p className="text-xs font-bold text-slate-800">Selamat Datang di AgroConnect</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Masuk atau buat akun untuk transaksi langsung dengan petani Indonesia.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            )}
          </div>

          <nav className="p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
              Menu Utama
            </span>

            {primaryNavLinks.map((item) => {
              const IconComp = item.icon
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp size={18} className={item.active ? 'text-white' : 'text-slate-500'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.active ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                Akun & Preferensi
              </span>

              {secondaryNavLinks.map((item) => {
                const IconComp = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      item.active
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp size={18} className={item.active ? 'text-white' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-md space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-300 shrink-0">
                <Sprout size={16} />
              </div>
              <p className="text-xs font-black tracking-tight leading-snug">
                Bersama Petani Membangun Ketahanan Pangan Indonesia
              </p>
            </div>
            <p className="text-[10px] text-emerald-200/80 leading-relaxed pl-9">
              Rantai pasok agrikultur digital terintegrasi data cuaca BMKG.
            </p>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                logout()
                onClose()
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut size={15} />
              <span>Keluar Akun</span>
            </button>
          )}

          <div className="text-[10px] text-slate-400 text-center leading-tight pb-1">
            <p className="font-semibold text-slate-500">AgroConnect Platform v1.0</p>
            <p>Standardisasi BNSP Full-Stack Developer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
