import { Product } from '../types/product'
import { FarmerProfile } from '../types/farmer'

/**
 * Converts farmer name string into URL-friendly identifier.
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

const FARMER_BANNERS = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&auto=format&fit=crop&q=80'
]

const FARMER_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
]

/**
 * Resolves complete farmer profile data by slug or name using real database catalog products.
 *
 * @param slugOrName - Identifier slug or full name of the farmer.
 * @param allProducts - Full catalog list from MongoDB.
 * @returns Fully populated FarmerProfile instance.
 */
export function getFarmerProfile(slugOrName: string, allProducts: Product[]): FarmerProfile {
  const cleanTarget = slugifyFarmerName(slugOrName)
  const matchedProducts = allProducts.filter(
    (p) => slugifyFarmerName(p.farmer_name) === cleanTarget || p.farmer_name.toLowerCase() === slugOrName.toLowerCase()
  )

  const representativeProduct = matchedProducts[0]
  const farmerName = representativeProduct ? representativeProduct.farmer_name : slugOrName.replace(/-/g, ' ')
  const region = representativeProduct ? representativeProduct.origin_region : 'Sentra Pertanian Jawa Barat'
  const seed = farmerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const bannerIndex = seed % FARMER_BANNERS.length
  const avatarIndex = (seed * 3) % FARMER_AVATARS.length
  const totalStock = matchedProducts.reduce((acc, p) => acc + p.stock_kg, 0)
  const categories = Array.from(new Set(matchedProducts.map((p) => p.category)))
  const primaryCategory = categories[0] || 'Komoditas Pangan'

  const isOrganicFarmer = matchedProducts.some((p) => p.is_organic)
  const farmingMethods = isOrganicFarmer
    ? ['Pertanian Organik Ramah Lingkungan', 'Pengendalian Hama Hayati (Pestisida Nabati)', 'Irigasi Mata Air Alami Pegunungan']
    : ['Good Agricultural Practices (GAP) Kementan', 'Pemupukan Berimbang Terstandarisasi', 'Sortir Mutu Pasca Panen Ketat']

  const certifications = isOrganicFarmer
    ? ['Sertifikasi Organik Indonesia (INOFICE)', 'Sertifikat Mutu Prima 3 Otoritas Pangan', 'Surat Tanda Daftar Usaha Perkebunan']
    : ['Sertifikat Registrasi Kebun Dinas Pertanian', 'Standar Mutu Nasional GAP Pangan', 'Kelompok Tani Berbadan Hukum Resmi']

  return {
    id: `farmer-${seed}`,
    slug: slugifyFarmerName(farmerName),
    name: farmerName,
    origin_region: region,
    avatar_url: FARMER_AVATARS[avatarIndex],
    banner_url: FARMER_BANNERS[bannerIndex],
    description: `Mitra kelompok tani resmi AgroConnect yang memproduksi komoditas ${primaryCategory.toLowerCase()} bermutu tinggi langsung dari lahan sentra ${region}. Seluruh komoditas dipanen terstandarisasi untuk menjamin kesegaran maksimal.`,
    total_products: matchedProducts.length,
    total_stock_kg: totalStock,
    primary_category: primaryCategory,
    is_organic: isOrganicFarmer,
    is_verified: true,
    farming_methods: farmingMethods,
    certifications,
    contact: {
      phone: '+62 812-8920-4411',
      address: `Kawasan Lahan Pertanian Sentra, ${region}`,
      operating_hours: 'Senin - Sabtu (06.00 - 17.00 WIB)',
      land_area: 'Lahan Produktif Sentra Tani Mitra'
    }
  }
}
