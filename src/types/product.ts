/**
 * Product represents an agricultural commodity stored in MongoDB.
 */
export interface Product {
  id: string
  name: string
  category: string
  price_per_kg: number
  stock_kg: number
  unit: string
  origin_region: string
  farmer_id?: number
  farmer_name: string
  farmer_avatar_url?: string
  is_organic: boolean
  description: string
  image_url?: string
  created_at: string
}

/**
 * CreateProductInput represents the form data for adding a new commodity.
 */
export interface CreateProductInput {
  name: string
  category: string
  price_per_kg: number
  stock_kg: number
  unit: string
  origin_region: string
  farmer_id?: number
  farmer_name: string
  farmer_avatar_url?: string
  is_organic: boolean
  description: string
  image_url?: string
}

/**
 * UpdateProductInput represents the form data for modifying an existing commodity.
 */
export interface UpdateProductInput {
  name?: string
  category?: string
  price_per_kg?: number
  stock_kg?: number
  unit?: string
  origin_region?: string
  is_organic?: boolean
  description?: string
  image_url?: string
}

