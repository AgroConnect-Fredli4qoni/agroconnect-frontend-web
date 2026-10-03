import React, { useState } from 'react'
import {
  X,
  Building,
  Smartphone,
  CheckCircle2,
  Trash2,
  Plus,
  AlertCircle,
  Loader2,
  Star,
  ShieldCheck
} from 'lucide-react'
import { PayoutAccount } from '../../types/wallet'
import {
  addPayoutAccount,
  setPrimaryPayoutAccount,
  deletePayoutAccount
} from '../../services/walletService'

const BANK_PROVIDERS = [
  'Bank Rakyat Indonesia (BRI)',
  'Bank Central Asia (BCA)',
  'Bank Mandiri',
  'Bank Negara Indonesia (BNI)',
  'Bank Syariah Indonesia (BSI)',
  'CIMB Niaga',
  'Bank Permata',
  'Bank Danamon'
]

const EWALLET_PROVIDERS = [
  'DANA',
  'GoPay',
  'OVO',
  'ShopeePay',
  'LinkAja'
]

/**
 * PayoutDestinationModalProps defines the properties required to render the payout management modal.
 */
export interface PayoutDestinationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  token: string
  accounts: PayoutAccount[]
  defaultHolderName?: string
}

/**
 * PayoutDestinationModal allows farmers to view, add, delete, and designate primary payout destinations.
 *
 * @param props - Configuration and handlers for payout destination management.
 * @returns Rendered JSX element.
 */
export function PayoutDestinationModal({
  isOpen,
  onClose,
  onSuccess,
  token,
  accounts,
  defaultHolderName = ''
}: PayoutDestinationModalProps): JSX.Element | null {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [accountType, setAccountType] = useState<'bank' | 'ewallet'>('bank')
  const [provider, setProvider] = useState<string>(BANK_PROVIDERS[0])
  const [accountNumber, setAccountNumber] = useState<string>('')
  const [accountHolder, setAccountHolder] = useState<string>(defaultHolderName)
  const [isPrimary, setIsPrimary] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleTypeChange = (type: 'bank' | 'ewallet') => {
    setAccountType(type)
    setProvider(type === 'bank' ? BANK_PROVIDERS[0] : EWALLET_PROVIDERS[0])
    setAccountNumber('')
    setErrorMessage(null)
  }

  const handleSetPrimary = async (accountId: number) => {
    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await setPrimaryPayoutAccount(accountId, token)
      setSuccessMessage('Arah pencairan utama berhasil diperbarui')
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui rekening utama'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (accountId: number) => {
    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await deletePayoutAccount(accountId, token)
      setSuccessMessage('Arah pencairan berhasil dihapus')
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus rekening tujuan'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const cleanedNumber = accountNumber.trim().replace(/\s+/g, '')
    if (!cleanedNumber || cleanedNumber.length < 8) {
      setErrorMessage('Nomor rekening atau nomor handphone minimal 8 digit angka')
      return
    }

    if (!accountHolder.trim()) {
      setErrorMessage('Nama pemilik rekening atau nama akun e-wallet wajib diisi')
      return
    }

    try {
      setIsSubmitting(true)
      await addPayoutAccount(
        {
          account_type: accountType,
          provider_name: provider,
          account_number: cleanedNumber,
          account_holder: accountHolder.trim(),
          is_primary: isPrimary || accounts.length === 0
        },
        token
      )

      setSuccessMessage('Arah pencairan baru berhasil ditambahkan!')
      setIsAddingNew(false)
      setAccountNumber('')
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menambahkan arah pencairan'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-5 sm:p-7 space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Building size={20} />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Kelola Arah Pencairan Dana
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Atur daftar rekening bank dan e-wallet tujuan pencairan saldo panen Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-medium">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-medium">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Rekening & E-Wallet Terdaftar ({accounts.length})
            </h3>
            {!isAddingNew && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(true)
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Baru</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className={`p-4 rounded-2xl border transition-all ${
                  acc.is_primary
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        acc.account_type === 'bank'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {acc.account_type === 'bank' ? <Building size={18} /> : <Smartphone size={18} />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {acc.provider_name}
                        </span>
                        {acc.is_primary && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                            <Star size={10} className="fill-current" />
                            <span>Utama</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-700 mt-1">
                        {acc.account_number}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        a.n. {acc.account_holder}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!acc.is_primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(acc.id)}
                        disabled={isSubmitting}
                        title="Jadikan sebagai rekening penarikan utama"
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>Pilih Utama</span>
                      </button>
                    )}
                    {accounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDelete(acc.id)}
                        disabled={isSubmitting}
                        title="Hapus rekening"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isAddingNew && (
          <form onSubmit={handleCreate} className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Plus size={14} className="text-emerald-700" />
                <span>Tambah Rekening / E-Wallet Baru</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('bank')}
                className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'bank'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building size={14} />
                <span>Rekening Bank</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('ewallet')}
                className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'ewallet'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone size={14} />
                <span>Akun E-Wallet</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Penyedia {accountType === 'bank' ? 'Bank' : 'E-Wallet'}
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {(accountType === 'bank' ? BANK_PROVIDERS : EWALLET_PROVIDERS).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {accountType === 'bank' ? 'Nomor Rekening Bank' : 'Nomor Handphone Terdaftar'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9-]/g, ''))}
                  placeholder={accountType === 'bank' ? 'Contoh: 012901084729503' : 'Contoh: 081298765432'}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Pemilik Rekening / Akun
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Contoh: Fredli Fourqoni"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Jadikan sebagai arah pencairan utama (default)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Simpan Rekening</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed">
          <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
          <span>
            AgroConnect memvalidasi nomor rekening dan akun e-wallet Anda secara aman. Seluruh pencairan hasil panen akan ditransfer langsung ke arah pencairan utama yang aktif.
          </span>
        </div>
      </div>
    </div>
  )
}
