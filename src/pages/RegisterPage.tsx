import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * RegisterPage renders dedicated registration view for new AgroConnect members.
 *
 * @returns JSX Element presenting account registration form with password toggle.
 */
export function RegisterPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    try {
      await register({ name, email, password, role: 'farmer' })
      navigate('/login', {
        state: { registeredSuccess: 'Pendaftaran akun berhasil! Silakan masuk dengan akun baru Anda.' }
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Terjadi kesalahan saat memproses pendaftaran akun.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl p-8 transition-all">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-1.5 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🌱</span>
            <span className="text-2xl font-black text-emerald-900 tracking-tight">AgroConnect</span>
          </Link>
          <h1 className="text-xl font-black text-slate-900 mt-2">Daftar Akun Baru</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Bergabunglah dalam ekosistem rantai pasok agrikultur digital Nusantara.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700">
              Nama Lengkap
            </label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700">
              Alamat Email
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="reg-email"
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
            <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
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
            <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Sudah memiliki akun?{' '}
            <Link
              to="/login"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
