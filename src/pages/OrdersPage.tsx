import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, Calendar, MapPin, PackageCheck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserOrders } from '../services/api'
import { Order, OrderItem } from '../types/order'

/**
 * OrdersPage presents full-page user order history and transactional invoice details.
 *
 * @returns JSX Element rendering order cards and delivery information.
 */
export function OrdersPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const loadOrders = async (): Promise<void> => {
    if (!token || !user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const data = await fetchUserOrders(user.id, token)
      setOrders(data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memuat riwayat transaksi pesanan Anda')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } })
      return
    }
    loadOrders()
  }, [isAuthenticated, token, user])

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Autentikasi Diperlukan</h2>
          <p className="text-xs text-slate-500">Silakan masuk ke akun Anda untuk meninjau riwayat pesanan komoditas pertanian.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-2">
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Riwayat Transaksi Pesanan</h1>
          <p className="text-xs text-slate-500">Daftar pesanan hasil panen yang tercatat resmi pada database transaksional MySQL</p>
        </div>

        <button
          type="button"
          className="self-start sm:self-auto inline-flex items-center gap-2 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
          onClick={loadOrders}
          disabled={isLoading}
          title="Muat ulang data pesanan"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 mb-6">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Memuat riwayat transaksi pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-10 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <PackageCheck size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Belum Ada Riwayat Pesanan</h2>
          <p className="text-xs text-slate-500">Anda belum pernah melakukan pemesanan komoditas pertanian di AgroConnect.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            Mulai Belanja Hasil Panen
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.order_code} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ClipboardList size={18} className="text-emerald-600" />
                  <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">{order.order_code}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    order.status === 'PAID'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-500 block">Tujuan Pengiriman:</span>
                  <span className="text-slate-800">{order.shipping_address}</span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="pt-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                    <span className="col-span-5">Komoditas</span>
                    <span className="col-span-3">Harga Satuan</span>
                    <span className="col-span-2 text-center">Kuantitas</span>
                    <span className="col-span-2 text-right">Subtotal</span>
                  </div>
                  {order.items.map((it: OrderItem) => (
                    <div key={it.id || it.product_id} className="grid grid-cols-12 gap-2 items-center text-xs py-2 border-b border-slate-50 last:border-0">
                      <span className="col-span-5 font-semibold text-slate-800 truncate">{it.product_name}</span>
                      <span className="col-span-3 text-slate-500">Rp {it.price.toLocaleString('id-ID')}</span>
                      <span className="col-span-2 text-center font-bold text-slate-700">{it.quantity}</span>
                      <span className="col-span-2 text-right font-bold text-emerald-700">Rp {it.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-600">Total Pembayaran:</span>
                <span className="text-base font-black text-emerald-700">Rp {order.total_amount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
