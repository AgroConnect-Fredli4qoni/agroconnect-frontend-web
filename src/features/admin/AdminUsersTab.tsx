import React, { useEffect, useState } from 'react'
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  ShoppingBag,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchAdminUsers } from '../../services/adminService'
import { AdminUser } from '../../types/admin'

/**
 * Format numeric value into Indonesian Rupiah currency notation.
 *
 * @param amount - Numeric monetary value.
 * @returns Formatted currency string.
 */
function formatRupiah(amount: number): string {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safeAmount)
}

/**
 * Render user role indicator badge.
 *
 * @param role - Role specification (admin, farmer, buyer).
 * @returns JSX Element badge.
 */
function renderRoleBadge(role: string): React.JSX.Element {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold">
        Admin Platform
      </span>
    )
  }
  if (role === 'farmer') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
        Petani Mitra
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
      Pembeli
    </span>
  )
}

/**
 * AdminUsersTab provides comprehensive user account oversight and engagement metrics.
 *
 * @returns JSX Element rendering the user management interface.
 */
export function AdminUsersTab(): React.JSX.Element {
  const { token } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const loadUsers = async (): Promise<void> => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminUsers(token, selectedRole)
      setUsers(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat daftar pengguna'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [token, selectedRole])

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-xs text-slate-500 mt-0.5">Daftar akun seluruh peran dengan volume transaksi & pengeluaran.</p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
          <span>Muat Ulang</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama atau email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Peran' },
              { id: 'farmer', label: 'Petani' },
              { id: 'buyer', label: 'Pembeli' },
              { id: 'admin', label: 'Admin' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRole(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRole === tab.id
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-xs">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <Users size={16} className="text-emerald-600" />
            <span>Total Pengguna: {filteredUsers.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">Tanggal Bergabung</th>
                <th className="py-3 px-4">Total Pesanan</th>
                <th className="py-3 px-4">Total Akumulasi Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    <span>Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{u.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{u.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{renderRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{u.created_at}</td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <ShoppingBag size={13} className="text-slate-400" />
                        <span>{u.total_orders ?? u.order_count ?? 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatRupiah(u.total_spent ?? u.total_volume ?? 0)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <ShieldAlert size={28} className="mx-auto text-slate-300 mb-2" />
                    <span>Tidak ditemukan pengguna dengan kriteria tersebut.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
