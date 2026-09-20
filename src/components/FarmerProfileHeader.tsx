import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Star,
  Share2,
  Phone,
  Clock,
  Check,
  X,
  Sprout,
  Store
} from 'lucide-react'
import { FarmerProfile } from '../types/farmer'

/**
 * FarmerProfileHeaderProps specifies farmer profile data and current catalog count.
 */
export interface FarmerProfileHeaderProps {
  farmer: FarmerProfile
  productCount: number
}

/**
 * FarmerProfileHeader renders the store banner, verified farmer credentials, store statistics, and contact triggers.
 *
 * @param props - Farmer details and total listed products count.
 * @returns JSX Element presenting header hero banner and profile summary.
 */
export function FarmerProfileHeader(props: FarmerProfileHeaderProps): React.JSX.Element {
  const { farmer, productCount } = props
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false)
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false)
  const [bannerFailed, setBannerFailed] = useState<boolean>(false)

  const handleShare = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Katalog Hasil Panen</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">
          Profil Resmi Mitra Tani AgroConnect
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
        <div className="relative w-full h-48 sm:h-64 lg:h-72 bg-slate-900 overflow-hidden">
          {!bannerFailed ? (
            <img
              src={farmer.banner_url}
              alt={`Lahan ${farmer.name}`}
              className="w-full h-full object-cover opacity-90"
              onError={() => setBannerFailed(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white p-1.5 shadow-xl border border-slate-200 shrink-0">
                {!avatarFailed ? (
                  <img
                    src={farmer.avatar_url}
                    alt={farmer.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                    <Sprout size={48} />
                  </div>
                )}
                {farmer.is_verified && (
                  <div
                    className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white"
                    title="Petani Terverifikasi AgroConnect"
                  >
                    <Check size={16} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {farmer.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck size={13} className="text-emerald-700" />
                    <span>Mitra Terverifikasi</span>
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">{farmer.origin_region}</span>
                </div>

                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed mt-2">
                  {farmer.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0 self-center sm:self-end">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Phone size={15} />
                <span>Hubungi Petani</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
                title="Salin tautan toko"
              >
                {isCopied ? (
                  <>
                    <Check size={15} className="text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} className="text-slate-500" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs mb-1">
                <Star size={15} className="fill-amber-400 text-amber-500" />
                <span>Rating Toko</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">{farmer.rating}</span>
                <span className="text-[11px] text-slate-400">/ 5.0 ({farmer.total_reviews} ulasan)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-1">
                <Store size={15} />
                <span>Komoditas Aktif</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">{productCount}</span>
                <span className="text-[11px] text-slate-400">Pilihan Panen</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs mb-1">
                <Sprout size={15} className="text-emerald-600" />
                <span>Pengalaman Panen</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">Sejak {farmer.joined_year}</span>
                <span className="text-[11px] text-slate-400">Mitra Resmi</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-teal-700 font-bold text-xs mb-1">
                <Clock size={15} />
                <span>Respons Chat</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">{farmer.response_rate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Informasi Kontak Petani</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Telepon & WhatsApp</span>
                <span className="text-sm font-black text-slate-900 block">{farmer.contact.phone}</span>
                <span className="text-[11px] text-emerald-700 font-semibold block">Siap melayani pemesanan grosir & partai besar</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Alamat Kebun / Lahan</span>
                <span className="text-xs font-semibold text-slate-800 block leading-relaxed">{farmer.contact.address}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jam Operasional Petani</span>
                <span className="text-xs font-semibold text-slate-800 block">{farmer.contact.operating_hours}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kapasitas Wilayah Lahan</span>
                <span className="text-xs font-semibold text-slate-800 block">{farmer.contact.land_area}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsContactOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
