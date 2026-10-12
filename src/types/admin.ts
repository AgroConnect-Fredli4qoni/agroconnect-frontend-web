import { Order } from './order'

/**
 * PlatformAdminStats represents aggregated executive statistics across all domains.
 */
export interface PlatformAdminStats {
  total_gmv: number
  total_orders: number
  total_farmers: number
  total_buyers: number
  pending_orders: number
  paid_orders: number
  shipped_orders: number
  completed_orders: number
  cancelled_orders: number
  pending_withdrawals_count: number
  pending_withdrawals_amount: number
  recent_orders: Order[]
}

/**
 * AdminUser represents a platform account with transaction and spending aggregates.
 */
export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'farmer' | 'buyer'
  avatar_url: string
  created_at: string
  total_orders: number
  total_spent: number
}

/**
 * AdminWithdrawalItem represents a farmer escrow withdrawal request requiring administrative oversight.
 */
export interface AdminWithdrawalItem {
  id: number
  user_id: number
  farmer_name: string
  farmer_email: string
  amount: number
  bank_name: string
  account_number: string
  account_holder: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  admin_notes: string
  created_at: string
  updated_at: string
}

/**
 * ServiceHealthStatus defines the diagnostic state of an AgroConnect ecosystem service.
 */
export interface ServiceHealthStatus {
  id: string
  name: string
  port: number
  protocol: 'HTTP' | 'REST' | 'TCP'
  containerName: string
  endpoint: string
  status: 'UP' | 'DOWN' | 'CHECKING'
  latencyMs?: number
  version?: string
  lastChecked: string
}
