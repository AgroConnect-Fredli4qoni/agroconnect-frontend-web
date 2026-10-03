import React from 'react'
import { PieChart } from 'lucide-react'
import { StatusBreakdownItem } from '../../types/order'
import { ORDER_STATUS_CONFIG } from '../../services/orderPipeline'

/**
 * OrderStatusDistributionProps defines properties required by OrderStatusDistribution.
 */
export interface OrderStatusDistributionProps {
  breakdown: StatusBreakdownItem[]
  totalOrders: number
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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
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
                const meta = ORDER_STATUS_CONFIG[item.status] || ORDER_STATUS_CONFIG.PENDING
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
                const meta = ORDER_STATUS_CONFIG[item.status] || ORDER_STATUS_CONFIG.PENDING
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
