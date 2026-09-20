import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sprout } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * LoginPage provides dedicated authentication portal for registered users.
 *
 * @returns JSX Element presenting user login form.
 */
export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await login({ email, password })
      setSuccessMsg('Login berhasil! Mengalihkan...')
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 500)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal masuk ke akun. Periksa kredensial Anda.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl p-8 transition-all">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-1.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sprout size={22} />
            </div>
            <span className="text-2xl font-black text-emerald-900 tracking-tight">AgroConnect</span>
          </Link>
          <h1 className="text-xl font-black text-slate-900 mt-2">Masuk ke Akun Anda</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Akses dasbor komoditas, riwayat pesanan, dan transaksi pasar tani.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
              Alamat Email
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Memproses Masuk...' : 'Masuk Sekarang'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akun?{' '}
            <Link
              to="/register"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
