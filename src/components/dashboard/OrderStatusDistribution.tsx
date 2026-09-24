import React from 'react'
import { PieChart, CheckCircle2, Clock, Truck, ShieldCheck, XCircle, LucideIcon } from 'lucide-react'
import { OrderStatus, StatusBreakdownItem } from '../../types/order'

/**
 * OrderStatusDistributionProps defines properties required by OrderStatusDistribution.
 */
export interface OrderStatusDistributionProps {
  breakdown: StatusBreakdownItem[]
  totalOrders: number
}

interface StatusMeta {
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: LucideIcon
}

const STATUS_METADATA: Record<OrderStatus, StatusMeta> = {
  COMPLETED: {
    label: 'Pesanan Selesai',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: CheckCircle2,
  },
  PAID: {
    label: 'Pembayaran Diterima',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: ShieldCheck,
  },
  SHIPPED: {
    label: 'Sedang Dikirim',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: Truck,
  },
  PENDING: {
    label: 'Menunggu Pembayaran',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: Clock,
  },
  CANCELLED: {
    label: 'Transaksi Dibatalkan',
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    icon: XCircle,
  },
}

/**
 * OrderStatusDistribution visualizes order transaction breakdown with animated progress meters.
 *
 * @param props - Component configuration containing breakdown metrics and total orders count.
 * @returns JSX Element rendering order distribution panel.
 */
export function OrderStatusDistribution(props: OrderStatusDistributionProps): React.JSX.Element {
  const { breakdown, totalOrders } = props

  const activeBreakdown = breakdown.filter((item) => item.count > 0)

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Status Transaksi</h3>
              <p className="text-[11px] text-slate-500">Persentase status pemrosesan pesanan sistem</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            {totalOrders} Total
          </span>
        </div>

        {activeBreakdown.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Belum ada transaksi tercatat untuk distribusi status pesanan.
          </div>
        ) : (
          <>
            <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden mb-6">
              {activeBreakdown.map((item) => {
                const meta = STATUS_METADATA[item.status] || STATUS_METADATA.PENDING
                return (
                  <div
                    key={item.status}
                    style={{ width: `${item.percentage}%` }}
                    className={`${meta.color} transition-all duration-500`}
                    title={`${meta.label}: ${item.count} (${item.percentage}%)`}
                  />
                )
              })}
            </div>

            <div className="space-y-3.5">
              {activeBreakdown.map((item) => {
                const meta = STATUS_METADATA[item.status] || STATUS_METADATA.PENDING
                const IconComponent = meta.icon
                return (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md ${meta.bgColor} ${meta.textColor} flex items-center justify-center`}>
                          <IconComponent size={14} />
                        </span>
                        <span className="font-semibold text-slate-700">{meta.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.count}</span>
                        <span className="text-[11px] font-medium text-slate-400">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className={`h-full ${meta.color} rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
