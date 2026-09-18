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
  }[]
}
