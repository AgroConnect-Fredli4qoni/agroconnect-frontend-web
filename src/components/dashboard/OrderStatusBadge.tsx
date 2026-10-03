import React from 'react'
import { OrderStatus } from '../../types/order'
import { ORDER_STATUS_CONFIG } from '../../services/orderPipeline'

/**
 * OrderStatusBadgeProps defines configuration properties for rendering an OrderStatusBadge.
 */
export interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
}

/**
 * OrderStatusBadge renders an accessible, consistently-styled pill badge for order lifecycle states.
 *
 * @param props - Component configuration including status, size, and display options.
 * @returns JSX Element rendering the styled status badge.
 */
export function OrderStatusBadge(props: OrderStatusBadgeProps): React.JSX.Element {
  const { status, size = 'sm', showIcon = true, className = '' } = props
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.PENDING
  const IconComponent = config.icon

  const sizeClasses =
    size === 'md'
      ? 'text-xs px-2.5 py-1 gap-1.5'
      : 'text-[11px] px-2 py-0.5 gap-1'

  const iconSize = size === 'md' ? 14 : 12

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${config.badgeClass} ${sizeClasses} ${className}`}
    >
      {showIcon && <IconComponent size={iconSize} className="shrink-0" />}
      <span>{status}</span>
    </span>
  )
}
