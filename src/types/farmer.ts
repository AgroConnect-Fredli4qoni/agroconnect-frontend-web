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
 * FarmerProfile models agricultural producer details and real commodity metrics.
 */
export interface FarmerProfile {
  id: string
  slug: string
  name: string
  origin_region: string
  avatar_url: string
  banner_url: string
  description: string
  total_products: number
  total_stock_kg: number
  primary_category: string
  is_organic: boolean
  is_verified: boolean
  farming_methods: string[]
  certifications: string[]
  contact: FarmerContactInfo
}
