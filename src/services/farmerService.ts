import { Product } from '../types/product'
import { FarmerProfile, FarmerApiRecord } from '../types/farmer'

/**
 * Converts farmer or cooperative title into URL-friendly slug identifier.
 *
 * @param name - Official farmer or cooperative title.
 * @returns Lowercase hyphenated slug string.
 */
export function slugifyFarmerName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Builds a comprehensive FarmerProfile by combining MongoDB database records with active commodity catalog data.
 *
 * @param record - Official farmer document fetched from MongoDB via Catalog Service.
 * @param matchedProducts - Array of catalog products belonging to this farmer.
 * @returns Fully populated FarmerProfile instance.
 */
export function buildFarmerProfile(record: FarmerApiRecord, matchedProducts: Product[]): FarmerProfile {
  const totalStock = matchedProducts.reduce((acc, p) => acc + p.stock_kg, 0)
  const categories = Array.from(new Set(matchedProducts.map((p) => p.category)))
  const primaryCategory = categories[0] || 'Komoditas Pangan'
  const isOrganic = matchedProducts.some((p) => p.is_organic)

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    origin_region: record.origin_region,
    avatar_url: record.avatar_url,
    banner_url: record.banner_url,
    description: record.description,
    total_products: matchedProducts.length,
    total_stock_kg: totalStock,
    primary_category: primaryCategory,
    is_organic: isOrganic,
    is_verified: record.is_verified,
    farming_methods: record.farming_methods || [],
    certifications: record.certifications || [],
    contact: {
      phone: record.phone,
      address: record.address,
      operating_hours: record.operating_hours,
      land_area: record.land_area
    }
  }
}
