import React from 'react'
import {
  Award,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  MapPin,
  Clock,
  HeartHandshake
} from 'lucide-react'
import { FarmerProfile } from '../types/farmer'

/**
 * FarmerAboutTabProps defines farmer background, cultivation practices, and legal certifications.
 */
export interface FarmerAboutTabProps {
  farmer: FarmerProfile
}

/**
 * FarmerAboutTab renders agricultural practices, sustainability commitments, and official certification badges.
 *
 * @param props - Farmer profile specifications.
 * @returns JSX Element presenting farm history and credentials.
 */
export function FarmerAboutTab(props: FarmerAboutTabProps): React.JSX.Element {
  const { farmer } = props

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Sprout size={20} className="text-emerald-700" />
          <h3 className="font-black text-lg">Tentang Kelompok Tani & Lahan</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {farmer.description} Kelompok tani ini membina puluhan petani lokal di kawasan {farmer.origin_region} dengan menerapkan tata kelola budidaya terpadu demi menjaga kelestarian tanah dan menjamin kontinuitas pasokan pangan bergizi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Sentra Produksi & Perkebunan</span>
              <span className="text-slate-500 mt-0.5 block">{farmer.contact.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <Clock size={18} className="text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Waktu Panen & Operasional</span>
              <span className="text-slate-500 mt-0.5 block">{farmer.contact.operating_hours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <h3 className="font-black text-base">Metode Tanam & Standar Mutu</h3>
          </div>
          <p className="text-xs text-slate-500">
            Seluruh hasil panen diproduksi melalui proses seleksi ketat tanpa mengorbankan ekosistem hayati.
          </p>
          <div className="space-y-2.5">
            {farmer.farming_methods.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50/60 border border-emerald-100/80 text-xs font-semibold text-emerald-900"
              >
                <Sprout size={14} className="text-emerald-700 shrink-0" />
                <span>{method}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Award size={18} className="text-amber-600" />
            <h3 className="font-black text-base">Sertifikasi & Legalitas Tani</h3>
          </div>
          <p className="text-xs text-slate-500">
            Bukti kepatuhan standar mutu pangan dan perlindungan konsumen resmi pemerintah.
          </p>
          <div className="space-y-2.5">
            {farmer.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs font-semibold text-amber-950"
              >
                <ShieldCheck size={14} className="text-amber-600 shrink-0" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
            <HeartHandshake size={24} className="text-emerald-300" />
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base">Mendukung Kesejahteraan Petani Lokal</h4>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              100% pembayaran komoditas disalurkan langsung tanpa perantara tengkulak berlebih.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-bold border border-white/20">
          <ShieldCheck size={14} className="text-emerald-300" />
          <span>Mitra Terverifikasi BNSP</span>
        </div>
      </div>
    </div>
  )
}
