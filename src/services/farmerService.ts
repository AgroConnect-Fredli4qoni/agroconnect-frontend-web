import { Product } from '../types/product'
import { FarmerProfile, FarmerReview } from '../types/farmer'

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
 * Resolves complete farmer profile data by slug or name using available catalog products.
 *
 * @param slugOrName - Identifier slug or full name of the farmer.
 * @param allProducts - Full catalog list for commodity association.
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
  const totalSales = matchedProducts.reduce((acc, p) => acc + p.stock_kg * 3, 450 + (seed % 300))
  const rating = Number((4.8 + ((seed % 3) * 0.1)).toFixed(1))
  const totalReviews = 45 + (seed % 80)
  const joinedYear = 2021 + (seed % 4)

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
    description: `Mitra petani andalan AgroConnect yang berdedikasi menghasilkan komoditas pangan bermutu tinggi langsung dari lahan sentra ${region}. Berpengalaman mengelola panen terstandarisasi untuk menjamin kesegaran dan nutrisi maksimal ke tangan konsumen.`,
    rating,
    total_reviews: totalReviews,
    total_sales_kg: totalSales,
    joined_year: joinedYear,
    response_rate: '99% (Sangat Cepat)',
    is_verified: true,
    farming_methods: farmingMethods,
    certifications,
    contact: {
      phone: '+62 812-8920-4411',
      address: `Kawasan Lahan Pertanian Sentra, ${region}`,
      operating_hours: 'Senin - Sabtu (06.00 - 17.00 WIB)',
      land_area: `${3 + (seed % 6)} Hektar Lahan Produktif`
    }
  }
}

/**
 * Generates verified buyer feedback for the selected farmer and their commodities.
 *
 * @param farmerName - Name of the farmer producer.
 * @param farmerProducts - Products provided by this farmer.
 * @returns Array of realistic customer reviews.
 */
export function getFarmerReviews(farmerName: string, farmerProducts: Product[]): FarmerReview[] {
  const seed = farmerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const primaryProduct = farmerProducts[0]?.name || 'Komoditas Pangan Pilihan'
  const secondaryProduct = farmerProducts[1]?.name || farmerProducts[0]?.name || 'Hasil Panen Segar'

  return [
    {
      id: `rev-${seed}-1`,
      buyer_name: 'Hendra Gunawan',
      rating: 5,
      date: '16 September 2026',
      comment: `Kualitas ${primaryProduct} dari ${farmerName} benar-benar luar biasa. Barang sampai dalam kondisi segar tanpa cacat, kemasan rapi dan higienis. Pasti langganan untuk kebutuhan resto kami.`,
      product_name: primaryProduct,
      helpful_count: 14
    },
    {
      id: `rev-${seed}-2`,
      buyer_name: 'Dewi Anggraini',
      rating: 5,
      date: '12 September 2026',
      comment: `Sangat puas belanja langsung dari petaninya! Terasa sekali bedanya antara produk fresh dari kebun ${farmerName} dibanding beli di pasar biasa. Aromanya khas dan rasanya mantap.`,
      product_name: secondaryProduct,
      helpful_count: 9
    },
    {
      id: `rev-${seed}-3`,
      buyer_name: 'Bambang Sudarmono',
      rating: 4,
      date: '05 September 2026',
      comment: `Pengiriman cepat dan komunikasi petani sangat ramah ketika ditanya tips penyimpanan. Komoditas ${primaryProduct} berbobot padat sesuai deskripsi. Rekomendasi untuk keluarga sehat.`,
      product_name: primaryProduct,
      helpful_count: 6
    },
    {
      id: `rev-${seed}-4`,
      buyer_name: 'Siti Nurhaliza',
      rating: 5,
      date: '28 Agustus 2026',
      comment: `Langsung dipanen begitu ada order masuk, tingkat kesegaran 100% terjaga. Senang sekali bisa mendukung petani lokal seperti ${farmerName}. Sukses selalu!`,
      product_name: secondaryProduct,
      helpful_count: 11
    }
  ]
}
