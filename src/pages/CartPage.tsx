import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle2, ShieldCheck, MapPin, User, CreditCard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import { CartItem, Order } from '../types/order'

/**
 * CartPage provides dedicated full-page shopping cart review, shipping details, and ACID checkout.
 *
 * @returns JSX Element presenting cart items and checkout invoice summary.
 */
export function CartPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart()
  const { user, token, isAuthenticated } = useAuth()

  const [customerName, setCustomerName] = useState<string>(user?.name || '')
  const [shippingAddress, setShippingAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  const handleCheckout = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!isAuthenticated || !token || !user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    if (items.length === 0) {
      setErrorMsg('Keranjang belanja Anda masih kosong')
      return
    }

    if (!shippingAddress.trim()) {
      setErrorMsg('Mohon lengkapi alamat pengiriman komoditas')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    try {
      const payload = {
        user_id: user.id,
        shipping_address: shippingAddress.trim(),
        items: items.map((item: CartItem) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
      }

      const orderResult = await createOrder(payload, token)
      setCompletedOrder(orderResult)
      clearCart()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memproses transaksi pesanan ACID')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-emerald-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 size={56} className="text-emerald-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pesanan Berhasil Dikonfirmasi!</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Transaksi ACID telah tersimpan aman di database MySQL dan stok komoditas di MongoDB telah disinkronkan.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-left text-xs max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Nomor Pesanan</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">{completedOrder.order_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status Pembayaran</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">{completedOrder.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Metode Pembayaran</span>
              <span className="font-semibold text-slate-800">{paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Alamat Pengiriman</span>
              <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{completedOrder.shipping_address}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
              <span>Total Pembayaran</span>
              <span className="text-lg font-black text-emerald-600">Rp {completedOrder.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/orders')}
            >
              Lihat Riwayat Pesanan
            </button>
            <Link
              to="/"
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all inline-block"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-lg text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Keranjang Belanja Masih Kosong</h2>
          <p className="text-xs text-slate-500">Anda belum menambahkan komoditas hasil panen petani ke keranjang.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <ArrowLeft size={16} />
            <span>Jelajahi Hasil Panen Petani</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-2">
          <ArrowLeft size={16} />
          <span>Lanjut Belanja</span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Keranjang Belanja Komoditas</h1>
        <p className="text-xs text-slate-500">Periksa pesanan hasil bumi Anda dan lengkapi rincian pengiriman</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 mb-6">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-3 border-b border-slate-200">
            <span>Daftar Komoditas ({totalItems} item)</span>
            <button
              type="button"
              className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors cursor-pointer"
              onClick={clearCart}
            >
              Kosongkan Keranjang
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item: CartItem) => (
              <div
                key={item.product_id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{item.product_name}</h3>
                  <span className="text-xs text-slate-500">Rp {item.price.toLocaleString('id-ID')} / {item.unit}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-xs text-xs cursor-pointer"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-xs text-xs disabled:opacity-40 cursor-pointer"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_available}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">Tersedia: {item.stock_available}</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[140px]">
                  <span className="text-sm font-extrabold text-emerald-700">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    onClick={() => removeItem(item.product_id)}
                    title="Hapus item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <form onSubmit={handleCheckout} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4 sticky top-6">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Ringkasan & Pembayaran</h2>

            <div className="space-y-1.5">
              <label htmlFor="cust-name" className="block text-xs font-semibold text-slate-700">Nama Penerima</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  id="cust-name"
                  type="text"
                  required
                  placeholder="Nama lengkap pemesan"
                  value={customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ship-address" className="block text-xs font-semibold text-slate-700">Alamat Pengiriman Lengkap</label>
              <div className="relative flex items-start">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <textarea
                  id="ship-address"
                  required
                  rows={3}
                  placeholder="Jalan, Nomor, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  value={shippingAddress}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShippingAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pay-method" className="block text-xs font-semibold text-slate-700">Metode Pembayaran</label>
              <div className="relative flex items-center">
                <CreditCard size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  id="pay-method"
                  value={paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all cursor-pointer"
                >
                  <option value="QRIS">QRIS Agrikultur Instan</option>
                  <option value="Transfer Bank BCA">Transfer Bank BCA Virtual Account</option>
                  <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                  <option value="Tunai saat Terima">Tunai saat Terima (COD Petani)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} komoditas)</span>
                <span className="font-semibold text-slate-800">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Layanan & Pengiriman</span>
                <span className="font-semibold text-emerald-600">Gratis (Subsidi Tani)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-sm font-black text-slate-900 flex justify-between items-center">
                <span>Total Tagihan</span>
                <span className="text-base text-emerald-700">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {!isAuthenticated ? (
              <button
                type="button"
                className="w-full mt-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
                onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
              >
                <span>Masuk untuk Melanjutkan Pembayaran</span>
              </button>
            ) : (
              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                disabled={isSubmitting}
              >
                <ShieldCheck size={18} />
                <span>{isSubmitting ? 'Memproses Transaksi...' : 'Konfirmasi & Buat Pesanan (ACID)'}</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
