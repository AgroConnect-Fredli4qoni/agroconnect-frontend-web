import React from 'react'

/**
 * Footer displays platform metadata, BNSP SKKNI Level 6 certification standard, and BMKG integration attribution.
 *
 * @returns Rendered JSX element for global application footer.
 */
export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-12">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo/logo.png"
            alt="AgroConnect Logo"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div>
            <span className="font-bold text-white text-sm block">AgroConnect Platform</span>
            <p className="text-slate-400 text-xs mt-0.5">Solusi Agrikultur Cerdas & Rantai Pasok Hasil Tani Nusantara</p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 text-slate-400">
          <span>Standardisasi Kompetensi SKKNI Level 6 (BNSP)</span>
          <span>Data Cuaca Terintegrasi Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</span>
        </div>
      </div>
    </footer>
  )
}
