import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  KeyRound,
  Mail,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Lock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserProfile, updateUserProfile } from '../services/api'
import { DashboardSidebar } from '../components/DashboardSidebar'
import { FarmerProductsManager } from '../components/FarmerProductsManager'
import { SalesStatsDashboard } from '../components/SalesStatsDashboard'

/**
 * DashboardPage provides the two-column authenticated dashboard layout hosting the user profile manager.
 *
 * @returns JSX Element rendering the user dashboard.
 */
export function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, logout, updateUserSession } = useAuth()

  const [activeMenu, setActiveMenu] = useState<'stats' | 'profile' | 'products'>('stats')
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')
  const [name, setName] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } })
      return
    }

    if (user) {
      setName(user.name)
    }

    if (token) {
      fetchUserProfile(token)
        .then((profile) => {
          setName(profile.name)
          updateUserSession(profile)
        })
        .catch(() => {})
    }
  }, [isAuthenticated, token])

  const handleUpdateName = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token || !user) return

    const trimmedName = name.trim()
    if (!trimmedName) {
      setErrorMsg('Nama lengkap tidak boleh kosong')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const result = await updateUserProfile({ name: trimmedName }, token)
      updateUserSession(result.user, result.token)
      setSuccessMsg('Profil akun Anda berhasil diperbarui!')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui profil pengguna')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token) return

    setErrorMsg('')
    setSuccessMsg('')

    if (!oldPassword) {
      setErrorMsg('Harap masukkan kata sandi lama Anda')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak sesuai')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateUserProfile(
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        token
      )
      updateUserSession(result.user, result.token)
      setSuccessMsg('Kata sandi Anda berhasil diubah dengan aman!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui kata sandi akun')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
          onSelectMenu={(menu) => setActiveMenu(menu as 'stats' | 'profile' | 'products')}
          onLogout={logout}
        />

        <section className="flex-1 min-w-0 w-full space-y-6">
          {activeMenu === 'stats' && <SalesStatsDashboard />}
          {activeMenu === 'products' && <FarmerProductsManager />}
          {activeMenu === 'profile' && (
            <>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-center sm:self-auto">
                  <BadgeCheck size={13} />
                  {user.role === 'admin' ? 'Administrator' : user.role === 'farmer' ? 'Mitra Petani' : 'Pembeli Komoditas'}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('info')
                setErrorMsg('')
                setSuccessMsg('')
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User size={15} />
              <span>Informasi Profil</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('security')
                setErrorMsg('')
                setSuccessMsg('')
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound size={15} />
              <span>Keamanan & Kata Sandi</span>
            </button>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Detail Akun & Identitas</h3>
                <p className="text-xs text-slate-500">Perbarui nama pengguna yang ditampilkan pada transaksi dan katalog.</p>
              </div>

              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                    <div className="relative flex items-center">
                      <User size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nama lengkap Anda"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Alamat Email</label>
                    <div className="relative flex items-center">
                      <Mail size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                      />
                      <Lock size={13} className="absolute right-3 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">Email akun bersifat permanen sebagai identitas login unik.</p>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Peran Sistem (Role)</label>
                    <input
                      type="text"
                      value={user.role === 'admin' ? 'Administrator' : user.role === 'farmer' ? 'Mitra Petani' : 'Pembeli'}
                      disabled
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || name.trim() === user.name}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Perbarui Kata Sandi</h3>
                <p className="text-xs text-slate-500">Gunakan kombinasi kata sandi yang kuat untuk melindungi akun dan akses sistem.</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</label>
                  <div className="relative flex items-center">
                    <KeyRound size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      placeholder="Masukkan kata sandi lama"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Kata Sandi Baru</label>
                  <div className="relative flex items-center">
                    <KeyRound size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative flex items-center">
                    <KeyRound size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Ulangi kata sandi baru"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !oldPassword || !newPassword || !confirmPassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>Perbarui Kata Sandi</span>
                  </button>
                </div>
              </form>
            </div>
          )}
          </>
          )}
        </section>
      </div>
    </div>
  )
}
