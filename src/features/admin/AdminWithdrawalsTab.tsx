import React, { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Check,
  X,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchAdminWithdrawals, updateAdminWithdrawalStatus } from '../../services/adminService'
import { AdminWithdrawalItem } from '../../types/admin'

/**
 * Format numeric value into Indonesian Rupiah currency notation.
 *
 * @param amount - Numeric monetary value.
 * @returns Formatted currency string.
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Render withdrawal transactional status badge.
 *
 * @param status - Status string code.
 * @returns JSX Element badge.
 */
function renderWithdrawalStatusBadge(status: string): React.JSX.Element {
  if (status === 'COMPLETED') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
        <CheckCircle2 size={12} />
        <span>Tuntas Ditransfer</span>
      </span>
    )
  }
  if (status === 'APPROVED') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
        <Check size={12} />
        <span>Disetujui Admin</span>
      </span>
    )
  }
  if (status === 'REJECTED') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
        <XCircle size={12} />
        <span>Ditolak</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
      <Clock size={12} />
      <span>Menunggu Review</span>
    </span>
  )
}

/**
 * AdminWithdrawalsTab oversees farmer escrow balance withdrawals, approval procedures, and disbursement reconciliation.
 *
 * @returns JSX Element rendering the escrow withdrawal manager.
 */
export function AdminWithdrawalsTab(): React.JSX.Element {
  const { token } = useAuth()
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [activeItem, setActiveItem] = useState<AdminWithdrawalItem | null>(null)
  const [targetStatus, setTargetStatus] = useState<string>('APPROVED')
  const [notes, setNotes] = useState<string>('')
  const [updating, setUpdating] = useState<boolean>(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const loadData = async (): Promise<void> => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminWithdrawals(token, statusFilter)
      setWithdrawals(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat permohonan pencairan dana'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token, statusFilter])

  const handleUpdateStatus = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token || !activeItem) return
    setUpdating(true)
    setError(null)
    try {
      await updateAdminWithdrawalStatus(activeItem.id, targetStatus, notes, token)
      setActionSuccess(`Status permohonan #${activeItem.id} berhasil diperbarui ke ${targetStatus}`)
      setActiveItem(null)
      setNotes('')
      await loadData()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui status permohonan'
      setError(message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Pencairan Saldo Petani (Escrow)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Verifikasi dan eksekusi permohonan penarikan dana hasil penjualan mitra tani.</p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
          <span>Muat Ulang</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'PENDING', label: 'Menunggu Review' },
              { id: 'APPROVED', label: 'Disetujui' },
              { id: 'COMPLETED', label: 'Selesai Ditransfer' },
              { id: 'REJECTED', label: 'Ditolak' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X size={15} />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-xs">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <ArrowDownToLine size={16} className="text-emerald-600" />
            <span>Total Permohonan: {withdrawals.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Petani Pemohon</th>
                <th className="py-3 px-4">Nominal Pencairan</th>
                <th className="py-3 px-4">Rekening Tujuan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu Pengajuan</th>
                <th className="py-3 px-4 text-center">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    <span>Memuat antrean pencairan dana...</span>
                  </td>
                </tr>
              ) : withdrawals.length > 0 ? (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{w.farmer_name}</div>
                      <div className="text-[11px] text-slate-400">{w.farmer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatRupiah(w.amount)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Building2 size={13} className="text-emerald-600" />
                        <span>{w.bank_name} - {w.account_number}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">a.n. {w.account_holder}</div>
                    </td>
                    <td className="py-3.5 px-4">{renderWithdrawalStatusBadge(w.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{w.created_at}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveItem(w)
                          setTargetStatus(w.status === 'PENDING' ? 'APPROVED' : 'COMPLETED')
                          setNotes(w.admin_notes || '')
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                      >
                        Verifikasi
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada antrean pencairan pada status ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleUpdateStatus}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Verifikasi Pencairan Saldo</h3>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Petani Pemohon:</span>
                <span className="font-bold text-slate-900">{activeItem.farmer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal Penarikan:</span>
                <span className="font-black text-emerald-700 text-sm">{formatRupiah(activeItem.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tujuan Bank:</span>
                <span className="font-semibold text-slate-800">{activeItem.bank_name} - {activeItem.account_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Atas Nama:</span>
                <span className="font-semibold text-slate-800">{activeItem.account_holder}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Tindakan Keputusan Admin</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-medium"
              >
                <option value="APPROVED">Setujui (APPROVED)</option>
                <option value="COMPLETED">Tuntas Ditransfer (COMPLETED)</option>
                <option value="REJECTED">Tolak Permohonan (REJECTED)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Catatan Verifikasi / Referensi Transfer</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: No. Ref Bank BCA 8921471 atau alasan penolakan..."
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
              >
                {updating ? 'Menyimpan...' : 'Simpan Keputusan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
