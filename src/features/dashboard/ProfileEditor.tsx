import React, { useState } from 'react'
import { BadgeCheck, Mail, Save, KeyRound, Loader2, CheckCircle2, AlertCircle, User as UserIcon, Lock } from 'lucide-react'
import { UserProfile } from '../../types/auth'
import { updateUserProfile } from '../../services/api'
import { ProfilePhotoUploader } from './ProfilePhotoUploader'

/**
 * ProfileEditorProps defines the contract for the consolidated profile management module.
 */
export interface ProfileEditorProps {
  user: UserProfile
  token: string | null
  onUpdateSuccess: (updatedUser: UserProfile, updatedToken?: string) => void
}

/**
 * ProfileEditor provides a deep, self-contained module for editing profile identity, avatar cropping, and password security.
 *
 * @param props - Module configuration including user profile data and update callback.
 * @returns Rendered JSX element for complete profile administration.
 */
export function ProfileEditor(props: ProfileEditorProps): React.JSX.Element {
  const { user, token, onUpdateSuccess } = props

  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')
  const [name, setName] = useState<string>(user.name || '')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleUpdateName = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token) return
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const response = await updateUserProfile({ name: name.trim() }, token)
      onUpdateSuccess(response.user, response.token)
      setSuccessMsg('Nama profil akun berhasil diperbarui.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui profil akun.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token) return

    if (!oldPassword) {
      setErrorMsg('Harap masukkan kata sandi lama Anda.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal harus 6 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak sesuai.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const response = await updateUserProfile(
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        token
      )
      onUpdateSuccess(response.user, response.token)
      setSuccessMsg('Kata sandi Anda berhasil diperbarui dengan aman!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui kata sandi akun.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0 overflow-hidden ring-4 ring-emerald-100">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
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
          <UserIcon size={15} />
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
        <div className="space-y-6">
          <ProfilePhotoUploader
            user={user}
            token={token}
            onUpdateSuccess={onUpdateSuccess}
          />

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Detail Akun & Identitas</h3>
              <p className="text-xs text-slate-500">Perbarui nama pengguna yang ditampilkan pada transaksi dan katalog komoditas.</p>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                  <div className="relative flex items-center">
                    <UserIcon size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
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
    </div>
  )
}
