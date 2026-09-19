import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * AuthPage provides dedicated full-page authentication for login and registration.
 *
 * @returns JSX Element rendering auth form with role selection.
 */
export function AuthPage(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

  const handleQuickLogin = (quickEmail: string, quickPass: string): void => {
    setEmail(quickEmail)
    setPassword(quickPass)
    setMode('login')
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await login({ email, password })
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        await register({ name, email, password, role })
        setSuccessMsg('Pendaftaran akun berhasil! Silakan masuk dengan kredensial Anda.')
        setMode('login')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Terjadi kesalahan saat memproses permintaan autentikasi')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-emerald-50/60 to-transparent">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 transition-all">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-4">
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-3xl">🌱</span>
            <h1 className="text-2xl font-black text-emerald-900 tracking-tight">AgroConnect</h1>
          </div>
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            {mode === 'login'
              ? 'Masuk ke platform ekosistem agrikultur cerdas'
              : 'Daftarkan akun Anda untuk terhubung ke rantai pasok hasil panen'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-xl my-6">
          <button
            type="button"
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => {
              setMode('login')
              setErrorMsg('')
              setSuccessMsg('')
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => {
              setMode('register')
              setErrorMsg('')
              setSuccessMsg('')
            }}
          >
            Daftar Akun Baru
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700">Nama Lengkap</label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700">Alamat Email</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-pass" className="block text-xs font-semibold text-slate-700">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                id="auth-pass"
                type="password"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-role" className="block text-xs font-semibold text-slate-700">Peran Pengguna</label>
              <div className="relative flex items-center">
                <ShieldCheck size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRole(e.target.value as 'farmer' | 'buyer')
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all cursor-pointer"
                >
                  <option value="farmer">Petani / Produsen Panen</option>
                  <option value="buyer">Pembeli / Konsumen Komoditas</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <span className="block text-xs font-semibold text-slate-500 mb-2.5">Akun Demo Pengujian Cepat:</span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickLogin('budi@tani.id', 'petani123')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-full transition-all cursor-pointer"
            >
              Budi Santoso (Petani)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('rina@pasar.id', 'pembeli123')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-full transition-all cursor-pointer"
            >
              Rina Wijaya (Pembeli)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
