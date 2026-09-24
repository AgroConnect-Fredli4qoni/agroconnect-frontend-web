import React, { useState, useRef } from 'react'
import { Camera, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { UserProfile } from '../../types/auth'
import { updateUserProfile } from '../../services/api'

/**
 * ProfilePhotoUploaderProps defines component configuration and session update callback.
 */
export interface ProfilePhotoUploaderProps {
  user: UserProfile
  token: string | null
  onUpdateSuccess: (updatedUser: UserProfile, updatedToken?: string) => void
}

/**
 * ProfilePhotoUploader provides client-side compressed image uploading and avatar management.
 *
 * @param props - Component properties containing user profile, session token, and update callback.
 * @returns JSX Element rendering profile photo uploader controls.
 */
export function ProfilePhotoUploader(props: ProfilePhotoUploaderProps): React.JSX.Element {
  const { user, token, onUpdateSuccess } = props

  const [preview, setPreview] = useState<string>(user.avatar_url || '')
  const [urlInput, setUrlInput] = useState<string>('')
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const compressAndSetImage = (file: File): void => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Berkas yang dipilih harus berupa gambar (JPG, PNG, WEBP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal adalah 5MB.')
      return
    }

    setErrorMsg('')
    setSuccessMsg('')

    const reader = new FileReader()
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDimension = 360
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          setPreview(compressedDataUrl)
        }
      }
      if (readerEvent.target?.result) {
        img.src = readerEvent.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      compressAndSetImage(file)
    }
  }

  const handleApplyUrl = (): void => {
    const trimmed = urlInput.trim()
    if (!trimmed) {
      setErrorMsg('Mohon masukkan URL gambar yang valid.')
      return
    }
    setErrorMsg('')
    setPreview(trimmed)
  }

  const handleSavePhoto = async (): Promise<void> => {
    if (!token) return
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const response = await updateUserProfile({ avatar_url: preview }, token)
      onUpdateSuccess(response.user, response.token)
      setSuccessMsg('Foto profil Anda berhasil diperbarui!')
      setShowUrlInput(false)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui foto profil.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemovePhoto = async (): Promise<void> => {
    if (!token) return
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const response = await updateUserProfile({ avatar_url: '__REMOVE__' }, token)
      onUpdateSuccess(response.user, response.token)
      setPreview('')
      setUrlInput('')
      setSuccessMsg('Foto profil berhasil dihapus dan kembali ke inisial nama.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal menghapus foto profil.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isChanged = preview !== (user.avatar_url || '')

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md ring-4 ring-emerald-500/10 transition-transform group-hover:scale-105 duration-300">
            {preview ? (
              <img src={preview} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center shadow-md transition-all cursor-pointer ring-2 ring-white"
            title="Pilih foto baru"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Foto Profil Akun</h3>
            <p className="text-xs text-slate-500">
              Unggah foto portrait Anda agar mudah dikenali oleh mitra tani dan pembeli pada transaksi komoditas.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
            >
              <Upload size={14} className="text-emerald-600" />
              <span>Pilih File Gambar</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <LinkIcon size={14} />
              <span>Gunakan URL</span>
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                title="Hapus foto dan kembali ke avatar inisial"
              >
                <Trash2 size={14} />
                <span>Hapus Foto</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400">Format didukung: JPG, PNG, WEBP. Maksimal 5MB (otomatis dioptimalkan).</p>
        </div>
      </div>

      {showUrlInput && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon size={15} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-800">Tautkan URL Gambar Eksternal</span>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... atau URL foto Anda"
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

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

      {isChanged && (
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md">
            Foto profil telah dipilih. Klik simpan untuk menerapkan.
          </span>
          <button
            type="button"
            onClick={handleSavePhoto}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span>Simpan Foto Profil</span>
          </button>
        </div>
      )}
    </div>
  )
}
