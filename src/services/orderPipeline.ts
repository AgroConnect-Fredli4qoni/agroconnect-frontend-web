import { Clock, ShieldCheck, Truck, CheckCircle2, XCircle, LucideIcon } from 'lucide-react'
import { Order, OrderStatus } from '../types/order'

/**
 * StatusFilterTab defines selectable filter options in transaction dashboard views.
 */
export type StatusFilterTab = 'ALL' | OrderStatus

/**
 * OrderStatusConfig encapsulates visual and descriptive metadata for order lifecycle statuses.
 */
export interface OrderStatusConfig {
  label: string
  shortLabel: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  badgeClass: string
  icon: LucideIcon
}

/**
 * ORDER_STATUS_CONFIG provides canonical presentation and metadata mappings for all order statuses.
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: {
    label: 'Menunggu Pembayaran',
    shortLabel: 'Menunggu',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  PAID: {
    label: 'Pembayaran Diterima',
    shortLabel: 'Terbayar',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: ShieldCheck,
  },
  SHIPPED: {
    label: 'Sedang Dikirim',
    shortLabel: 'Dikirim',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Truck,
  },
  COMPLETED: {
    label: 'Pesanan Selesai',
    shortLabel: 'Selesai',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Transaksi Dibatalkan',
    shortLabel: 'Dibatalkan',
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
}

/**
 * ORDER_STATUS_TABS provides standard tab definitions for transaction filters.
 */
export const ORDER_STATUS_TABS: { key: StatusFilterTab; label: string }[] = [
  { key: 'ALL', label: 'Semua' },
  { key: 'PENDING', label: 'Menunggu' },
  { key: 'PAID', label: 'Terbayar' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'COMPLETED', label: 'Selesai' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
]

/**
 * getAllowedNextStatuses computes legal subsequent order statuses based on ACID transition invariants.
 *
 * @param currentStatus - Current status of the order.
 * @param role - Authenticated actor role attempting the mutation.
 * @returns Array of permitted subsequent statuses.
 */
export function getAllowedNextStatuses(
  currentStatus: OrderStatus,
  role?: string
): OrderStatus[] {
  switch (currentStatus) {
    case 'PENDING':
      if (role === 'admin') {
        return ['PAID', 'SHIPPED', 'CANCELLED']
      }
      return ['PAID', 'CANCELLED']
    case 'PAID':
      return ['SHIPPED', 'COMPLETED', 'CANCELLED']
    case 'SHIPPED':
      return ['COMPLETED']
    case 'COMPLETED':
    case 'CANCELLED':
    default:
      return []
  }
}

/**
 * canTransitionStatus determines whether a requested state transition is valid under domain invariants.
 *
 * @param currentStatus - Existing order status.
 * @param nextStatus - Proposed next status.
 * @param role - Actor role performing the operation.
 * @returns Boolean flag indicating transition validity.
 */
export function canTransitionStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
  role?: string
): boolean {
  const allowed = getAllowedNextStatuses(currentStatus, role)
  return allowed.includes(nextStatus)
}

/**
 * filterOrders performs deterministic filtering and multi-field textual search over orders.
 *
 * @param orders - Array of orders to filter.
 * @param activeTab - Selected status filter tab.
 * @param searchQuery - Freeform search string for code, buyer, address, or product names.
 * @returns Filtered array of matching orders.
 */
export function filterOrders(
  orders: Order[],
  activeTab: StatusFilterTab,
  searchQuery: string
): Order[] {
  const query = searchQuery.trim().toLowerCase()

  return orders.filter((order) => {
    const matchesTab = activeTab === 'ALL' || order.status === activeTab
    if (!query) {
      return matchesTab
    }

    const matchesCode = order.order_code.toLowerCase().includes(query)
    const matchesCustomer = (order.customer_name || '').toLowerCase().includes(query)
    const matchesAddress = (order.shipping_address || '').toLowerCase().includes(query)
    const matchesItem = (order.items || []).some((item) =>
      item.product_name.toLowerCase().includes(query)
    )

    return matchesTab && (matchesCode || matchesCustomer || matchesAddress || matchesItem)
  })
}

/**
 * computeStatusCounts aggregates order quantities across all status filter tabs.
 *
 * @param orders - Array of orders to analyze.
 * @returns Map of status filter tab keys to their respective item counts.
 */
export function computeStatusCounts(orders: Order[]): Record<StatusFilterTab, number> {
  const counts: Record<StatusFilterTab, number> = {
    ALL: orders.length,
    PENDING: 0,
    PAID: 0,
    SHIPPED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  }

  for (const order of orders) {
    if (counts[order.status] !== undefined) {
      counts[order.status] += 1
    }
  }

  return counts
}
