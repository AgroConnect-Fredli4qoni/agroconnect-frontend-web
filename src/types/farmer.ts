/**
 * FarmerContactInfo defines communication channels and operational specifications.
 */
export interface FarmerContactInfo {
  phone: string
  address: string
  operating_hours: string
  land_area: string
}

/**
 * FarmerProfile models agricultural producer details, credentials, and performance metrics.
 */
export interface FarmerProfile {
  id: string
  slug: string
  name: string
  origin_region: string
  avatar_url: string
  banner_url: string
  description: string
  rating: number
  total_reviews: number
  total_sales_kg: number
  joined_year: number
  response_rate: string
  is_verified: boolean
  farming_methods: string[]
  certifications: string[]
  contact: FarmerContactInfo
}

/**
 * FarmerReview models buyer feedback, satisfaction score, and transaction context.
 */
export interface FarmerReview {
  id: string
  buyer_name: string
  rating: number
  date: string
  comment: string
  product_name: string
  helpful_count: number
}
