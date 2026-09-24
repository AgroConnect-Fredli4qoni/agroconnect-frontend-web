import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { TransactionManager } from '../components/dashboard/TransactionManager'

/**
 * OrdersPage presents full-page order history and transaction management.
 *
 * @returns JSX Element rendering transaction management interface.
 */
export function OrdersPage(): React.JSX.Element {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-10 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Autentikasi Diperlukan</h2>
          <p className="text-xs text-slate-500">
            Silakan masuk ke akun Anda untuk meninjau riwayat pesanan komoditas pertanian.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-all"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <TransactionManager />
    </div>
  )
}
