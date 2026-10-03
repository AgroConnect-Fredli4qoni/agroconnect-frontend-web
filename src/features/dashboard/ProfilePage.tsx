import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  Sprout,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchUserProfile } from '../../services/api'
import { ProfileEditor } from './ProfileEditor'

/**
 * ProfilePage presents authenticated user account management, personal details, and password update.
 *
 * @returns JSX Element rendering profile settings dashboard.
 */
export function ProfilePage(): React.JSX.Element {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, updateUserSession } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } })
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
          <p className="text-xs text-slate-500">Silakan masuk ke akun Anda untuk mengelola profil dan pengaturan keamanan.</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil Pengguna</h1>
            <p className="text-xs text-slate-500">Kelola identitas akun dan preferensi keamanan ekosistem AgroConnect</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Riwayat Pesanan</span>
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <Sprout size={14} />
            <span className="hidden sm:inline">Katalog Komoditas</span>
          </Link>
        </div>
      </div>

      <ProfileEditor
        user={user}
        token={token}
        onUpdateSuccess={(updatedUser, updatedToken) => updateUserSession(updatedUser, updatedToken)}
      />
    </div>
  )
}
