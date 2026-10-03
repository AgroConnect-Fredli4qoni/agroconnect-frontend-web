import React, { useState, useEffect, useCallback } from 'react'
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, RefreshCw, AlertCircle, Building, Smartphone } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchWalletOverview } from '../../services/walletService'
import { WalletOverview } from '../../types/wallet'
import { WithdrawModal } from './WithdrawModal'

/**
 * FarmerWalletTab renders the dedicated AgroConnect Farmer Wallet dashboard.
 *
 * @returns JSX Element presenting balance overview, escrow metrics, and mutation ledger.
 */
export function FarmerWalletTab(): React.JSX.Element {
  const { token } = useAuth()
  const [overview, setOverview] = useState<WalletOverview | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false)

  const loadWalletData = useCallback(async (): Promise<void> => {
    if (!token) return
    setIsLoading(true)
    setErrorMsg('')
    try {
      const data = await fetchWalletOverview(token)
      setOverview(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memuat informasi dompet digital')
      }
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadWalletData()
  }, [loadWalletData])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Dompet AgroConnect</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola saldo hasil panen, perlindungan escrow, dan pencairan tunai ke rekening/e-wallet.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadWalletData}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-emerald-600' : ''} />
          <span>Segarkan Saldo</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Saldo Siap Ditarik</span>
              <ShieldCheck size={18} className="text-emerald-200" />
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Rp {overview ? overview.wallet.balance.toLocaleString('id-ID') : '0'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWithdrawOpen(true)}
            disabled={!overview || overview.wallet.balance < 10000}
            className="w-full py-2.5 bg-white hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50 text-emerald-800 rounded-xl text-xs font-black transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowUpRight size={16} />
            <span>Tarik Saldo (Bank & E-Wallet)</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Saldo Tertahan (Escrow)</span>
            <div className="text-2xl font-black text-slate-900 mt-2">
              Rp {overview ? overview.wallet.pending_balance.toLocaleString('id-ID') : '0'}
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 font-medium leading-relaxed">
            Dana dari pesanan aktif yang sedang dalam pengiriman. Otomatis cair ke saldo utama setelah pembeli mengonfirmasi pesanan selesai.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Rekening Penarikan Terdaftar</span>
            <div className="flex items-center gap-2 mt-2">
              <Building size={18} className="text-emerald-700 shrink-0" />
              <span className="text-sm font-bold text-slate-800 truncate">
                {overview?.wallet.bank_name || 'Bank Rakyat Indonesia (BRI)'}
              </span>
            </div>
            <div className="text-xs font-black text-slate-900 mt-1 font-mono">
              {overview?.wallet.account_number || '0129-01-084729-50-3'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              a.n. {overview?.wallet.account_holder || 'Petani Terdaftar'}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex items-center gap-1">
            <Smartphone size={12} className="text-emerald-600" />
            <span>Dapat ditarik ke rekening lain atau E-Wallet sewaktu-waktu.</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-black text-slate-900">Buku Mutasi Saldo & Penarikan</h3>
          <span className="text-xs text-slate-500 font-medium">
            {overview?.transactions.length || 0} Riwayat Transaksi
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Memuat mutasi keuangan dompet...</p>
          </div>
        ) : !overview || overview.transactions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200/80 p-6 space-y-2">
            <p className="text-xs font-bold text-slate-700">Belum ada riwayat mutasi dompet</p>
            <p className="text-[11px] text-slate-400">Mutasi akan otomatis tercatat setiap ada pencairan pesanan panen atau penarikan dana.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] bg-slate-50/60">
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Keterangan</th>
                  <th className="py-2.5 px-3">Tipe</th>
                  <th className="py-2.5 px-3 text-right">Nominal</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overview.transactions.map((tx) => {
                  const isCredit = tx.type === 'credit_earning'
                  const formattedDate = new Date(tx.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">{formattedDate}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 min-w-[200px]">{tx.description}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCredit ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isCredit ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                          <span>{isCredit ? 'Pendapatan Panen' : 'Penarikan Dana'}</span>
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-black whitespace-nowrap ${
                        isCredit ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {isCredit ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {overview && (
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          currentBalance={overview.wallet.balance}
          token={token || ''}
          onSuccess={loadWalletData}
        />
      )}
    </div>
  )
}
