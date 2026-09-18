import React, { useState } from 'react'
import { X, LogIn, UserPlus, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types/auth'

/**
 * AuthModalProps defines modal open state and toggle callback.
 */
export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * AuthModal provides login and registration flows with test credential shortcuts.
 *
 * @param props - Modal controller properties.
 * @returns JSX Element rendering authentication dialog.
 */
export function AuthModal(props: AuthModalProps): React.JSX.Element {
  const { isOpen, onClose } = props
  const { login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('budi@tani.id')
  const [password, setPassword] = useState('petani123')
  const [role, setRole] = useState<UserRole>('farmer')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return <></>

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ name, email, password, role })
      }
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Otentikasi gagal. Silakan periksa kredensial.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestFarmer = (): void => {
    setMode('login')
    setEmail('budi@tani.id')
    setPassword('petani123')
  }

  const fillTestBuyer = (): void => {
    setMode('login')
    setEmail('rina@pasar.id')
    setPassword('pembeli123')
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            {mode === 'login' ? <LogIn size={22} className="text-primary" /> : <UserPlus size={22} className="text-primary" />}
            <h3>{mode === 'login' ? 'Masuk ke AgroConnect' : 'Daftar Akun Baru'}</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Daftar Baru
          </button>
        </div>

        {errorMsg && <div className="modal-error-alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="auth-name">Nama Lengkap *</label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-role">Peran Pengguna *</label>
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="farmer">Petani / Produsen Komoditas</option>
                  <option value="buyer">Pembeli / Konsumen Komoditas</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Alamat Email *</label>
            <input
              id="auth-email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-pass">Kata Sandi *</label>
            <input
              id="auth-pass"
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn full-width" disabled={isLoading}>
            {isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftarkan Akun'}
          </button>

          <div className="test-credentials-box">
            <div className="test-creds-title">
              <Shield size={14} />
              <span>Akun Pengujian Cepat (Seed Data Asesor)</span>
            </div>
            <div className="test-creds-btns">
              <button type="button" className="quick-fill-btn" onClick={fillTestFarmer}>
                Petani (budi@tani.id)
              </button>
              <button type="button" className="quick-fill-btn" onClick={fillTestBuyer}>
                Pembeli (rina@pasar.id)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
