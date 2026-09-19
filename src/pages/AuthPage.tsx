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
    <div className="auth-page-wrapper">
      <div className="auth-page-card">
        <div className="auth-page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="auth-brand">
            <span className="auth-brand-icon">🌱</span>
            <h1>AgroConnect</h1>
          </div>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Masuk ke platform ekosistem agrikultur cerdas'
              : 'Daftarkan akun Anda untuk terhubung ke rantai pasok hasil panen'}
          </p>
        </div>

        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
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
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register')
              setErrorMsg('')
              setSuccessMsg('')
            }}
          >
            Daftar Akun Baru
          </button>
        </div>

        {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form-layout">
          {mode === 'register' && (
            <div className="form-field">
              <label htmlFor="auth-name">Nama Lengkap</label>
              <div className="field-input-box">
                <User size={18} className="field-icon" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="auth-email">Alamat Email</label>
            <div className="field-input-box">
              <Mail size={18} className="field-icon" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="auth-pass">Kata Sandi</label>
            <div className="field-input-box">
              <Lock size={18} className="field-icon" />
              <input
                id="auth-pass"
                type="password"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-field">
              <label htmlFor="auth-role">Peran Pengguna</label>
              <div className="field-input-box">
                <ShieldCheck size={18} className="field-icon" />
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRole(e.target.value as 'farmer' | 'buyer')
                  }
                >
                  <option value="farmer">Petani / Produsen Panen</option>
                  <option value="buyer">Pembeli / Konsumen Komoditas</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            <span>{isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="demo-accounts-card">
          <span className="demo-title">Akun Demo Pengujian Cepat:</span>
          <div className="demo-btn-group">
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleQuickLogin('budi@tani.id', 'petani123')}
            >
              🌾 Petani (budi@tani.id)
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleQuickLogin('rina@pasar.id', 'pembeli123')}
            >
              🛒 Pembeli (rina@pasar.id)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
