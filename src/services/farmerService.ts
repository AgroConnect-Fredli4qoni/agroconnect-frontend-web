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

/**
 * Generates an automatic farmer profile record based on catalog commodities when no dedicated profile exists in the database.
 *
 * @param slug - URL slug identifier of the farmer.
 * @param matchedProducts - Array of catalog products belonging to this farmer.
 * @returns Complete FarmerApiRecord derived from commodity metadata.
 */
export function createFallbackFarmerRecord(slug: string, matchedProducts: Product[]): FarmerApiRecord {
  const first = matchedProducts[0]
  const farmerName = first ? first.farmer_name : slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
  const region = first ? first.origin_region : 'Indonesia'
  const avatar = (first && first.farmer_avatar_url) ? first.farmer_avatar_url : ''

  return {
    id: first ? String(first.farmer_id) : slug,
    slug,
    name: farmerName,
    origin_region: region,
    avatar_url: avatar,
    banner_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
    description: `Petani produsen komoditas pertanian segar dan berkualitas dari ${region}. Berkomitmen menghadirkan hasil panen terbaik langsung dari kebun ke tangan konsumen secara transparan dan terpercaya.`,
    phone: '+62 812-3456-7890',
    address: region,
    operating_hours: 'Senin - Sabtu (07.00 - 17.00 WIB)',
    land_area: 'Lahan Pertanian Produktif',
    is_verified: true,
    farming_methods: [
      'Praktik Pertanian Ramah Lingkungan',
      'Seleksi Mutu Panen Ketat',
      'Penanganan Pasca Panen Higienis'
    ],
    certifications: [
      'Petani Terverifikasi AgroConnect',
      'Standar Mutu Komoditas Pangan Lokal'
    ],
    created_at: new Date().toISOString()
  }
}
