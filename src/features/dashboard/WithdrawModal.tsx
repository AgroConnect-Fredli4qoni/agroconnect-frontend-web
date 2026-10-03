import React, { useState, useEffect } from 'react'
import { X, Building2, Smartphone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { requestWithdrawal } from '../../services/walletService'
import { PayoutAccount } from '../../types/wallet'

/**
 * WithdrawModalProps defines configuration for the cash-out modal.
 */
export interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
  token: string
  onSuccess: () => void
  payoutAccounts?: PayoutAccount[]
}

const BANK_PROVIDERS = ['Bank Rakyat Indonesia (BRI)', 'Bank Central Asia (BCA)', 'Bank Mandiri', 'Bank Negara Indonesia (BNI)']
const EWALLET_PROVIDERS = ['DANA', 'GoPay', 'OVO', 'ShopeePay']
const QUICK_AMOUNTS = [50000, 100000, 250000, 500000]

/**
 * WithdrawModal facilitates farmer earnings cash-out to verified bank accounts or e-wallets.
 *
 * @param props - Modal controller and balance state.
 * @returns Rendered JSX modal.
 */
export function WithdrawModal(props: WithdrawModalProps): React.JSX.Element | null {
  const { isOpen, onClose, currentBalance, token, onSuccess, payoutAccounts = [] } = props

  const [targetType, setTargetType] = useState<'bank' | 'ewallet'>('bank')
  const [targetProvider, setTargetProvider] = useState<string>(BANK_PROVIDERS[0])
  const [targetAccount, setTargetAccount] = useState<string>('')
  const [accountHolder, setAccountHolder] = useState<string>('')
  const [amountStr, setAmountStr] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen && payoutAccounts.length > 0) {
      const primary = payoutAccounts.find((a) => a.is_primary) || payoutAccounts[0]
      if (primary) {
        setTargetType(primary.account_type)
        setTargetProvider(primary.provider_name)
        setTargetAccount(primary.account_number)
        setAccountHolder(primary.account_holder)
      }
    }
  }, [isOpen, payoutAccounts])

  if (!isOpen) return null

  const handleTypeChange = (type: 'bank' | 'ewallet'): void => {
    setTargetType(type)
    setTargetProvider(type === 'bank' ? BANK_PROVIDERS[0] : EWALLET_PROVIDERS[0])
  }

  const handleQuickAmount = (val: number): void => {
    setAmountStr(String(Math.min(val, currentBalance)))
  }

  const handleWithdrawAll = (): void => {
    setAmountStr(String(Math.floor(currentBalance)))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setErrorMsg('')

    const numericAmount = Number(amountStr)
    if (!numericAmount || numericAmount < 10000) {
      setErrorMsg('Nominal penarikan minimal Rp 10.000')
      return
    }

    if (numericAmount > currentBalance) {
      setErrorMsg(`Saldo tidak mencukupi (Saldo Anda: Rp ${currentBalance.toLocaleString('id-ID')})`)
      return
    }

    if (!targetAccount.trim()) {
      setErrorMsg(targetType === 'bank' ? 'Nomor rekening bank wajib diisi' : 'Nomor handphone akun e-wallet wajib diisi')
      return
    }

    if (!accountHolder.trim()) {
      setErrorMsg('Nama pemilik akun / rekening wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      await requestWithdrawal(
        {
          amount: numericAmount,
          target_type: targetType,
          target_provider: targetProvider,
          target_account: targetAccount.trim(),
          account_holder: accountHolder.trim(),
        },
        token
      )

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onSuccess()
        onClose()
      }, 1800)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Terjadi kesalahan saat memproses penarikan dana')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">Tarik Saldo Petani</h3>
            <p className="text-xs text-slate-500 mt-0.5">Cairkan hasil panen langsung ke rekening bank atau e-wallet Anda.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-lg font-black text-slate-900">Penarikan Berhasil Diajukan!</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Dana sebesar <span className="font-bold text-emerald-700">Rp {Number(amountStr).toLocaleString('id-ID')}</span> sedang ditransfer ke {targetProvider} ({targetAccount}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Saldo Siap Ditarik</span>
                <span className="text-lg font-black text-emerald-900">Rp {currentBalance.toLocaleString('id-ID')}</span>
              </div>
              <button
                type="button"
                onClick={handleWithdrawAll}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                Tarik Semua
              </button>
            </div>

            {payoutAccounts && payoutAccounts.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Gunakan Rekening / E-Wallet Tersimpan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {payoutAccounts.map((acc) => {
                    const isSelected = targetAccount === acc.account_number && targetProvider === acc.provider_name
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setTargetType(acc.account_type)
                          setTargetProvider(acc.provider_name)
                          setTargetAccount(acc.account_number)
                          setAccountHolder(acc.account_holder)
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/30'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`p-1.5 rounded-lg shrink-0 ${acc.account_type === 'bank' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {acc.account_type === 'bank' ? <Building2 size={14} /> : <Smartphone size={14} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold truncate flex items-center justify-between">
                            <span>{acc.provider_name}</span>
                            {acc.is_primary && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-600 text-white rounded-full font-black">
                                Utama
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 truncate">
                            {acc.account_number}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Metode Penarikan</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('bank')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    targetType === 'bank'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 size={16} />
                  <span>Rekening Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('ewallet')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    targetType === 'ewallet'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone size={16} />
                  <span>E-Wallet</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {targetType === 'bank' ? 'Pilih Bank Tujuan' : 'Pilih Layanan E-Wallet'}
              </label>
              <select
                value={targetProvider}
                onChange={(e) => setTargetProvider(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              >
                {(targetType === 'bank' ? BANK_PROVIDERS : EWALLET_PROVIDERS).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {targetType === 'bank' ? 'Nomor Rekening' : 'Nomor Handphone E-Wallet'}
              </label>
              <input
                type="text"
                placeholder={targetType === 'bank' ? 'Contoh: 0129-01-084729-50-3' : 'Contoh: 081234567890'}
                value={targetAccount}
                onChange={(e) => setTargetAccount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Pemilik Akun</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso (harus sesuai identitas akun)"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Jumlah Penarikan (Rp)</label>
              <input
                type="number"
                placeholder="Minimal 10000"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                min="10000"
                max={currentBalance}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
              />

              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    + Rp {(amt / 1000).toLocaleString('id-ID')}rb
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isLoading ? (
                  <span>Memproses Penarikan...</span>
                ) : (
                  <>
                    <span>Konfirmasi Tarik Dana</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
