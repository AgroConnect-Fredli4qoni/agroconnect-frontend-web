/**
 * CartItem represents a product added to the buyer's shopping cart.
 */
export interface CartItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
  unit: string
  stock_available: number
  farmer_id?: number
}

/**
 * OrderItem represents a finalized order line item in MySQL.
 */
export interface OrderItem {
  id: number
  order_id: number
  product_id: string
  product_name: string
  price: number
  quantity: number
  subtotal: number
  farmer_id?: number
}

/**
 * OrderStatus defines the transactional status of an order.
 */
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'

/**
 * Order represents a recorded commodity order with ACID guarantee.
 */
export interface Order {
  id: number
  order_code: string
  user_id: number
  customer_name?: string
  customer_email?: string
  total_amount: number
  status: OrderStatus
  shipping_address: string
  created_at: string
  items?: OrderItem[]
}

/**
 * CheckoutPayload represents the request structure for creating a new order.
 */
export interface CheckoutPayload {
  user_id: number
  shipping_address: string
  items: {
    product_id: string
    product_name: string
    price: number
    quantity: number
    farmer_id?: number
  }[]
}

/**
 * TopProductStat represents commodity sales volume and revenue performance.
 */
export interface TopProductStat {
  product_id: string
  product_name: string
  total_quantity: number
  total_revenue: number
}

/**
 * StatusBreakdownItem represents the count and percentage of orders per transactional status.
 */
export interface StatusBreakdownItem {
  status: OrderStatus
  count: number
  percentage: number
}

/**
 * OrderStats encapsulates comprehensive sales analytics and transaction history.
 */
export interface OrderStats {
  total_revenue: number
  total_orders: number
  total_items_sold: number
  average_order_value: number
  status_breakdown: StatusBreakdownItem[]
  top_products: TopProductStat[]
  recent_orders: Order[]
}

/**
 * UpdateOrderStatusPayload defines the payload required to update order status.
 */
export interface UpdateOrderStatusPayload {
  status: OrderStatus
}
