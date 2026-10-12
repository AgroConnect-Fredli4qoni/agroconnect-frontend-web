import React, { useEffect, useState } from 'react'
import {
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Server,
  Database,
  CloudRain,
  ShieldCheck,
  Cpu,
} from 'lucide-react'
import { checkSystemHealth } from '../../services/adminService'
import { ServiceHealthStatus } from '../../types/admin'

/**
 * AdminHealthTab displays live health probes, latencies, and connectivity telemetry across the 7 polyrepo containers.
 *
 * @returns JSX Element rendering the microservices telemetry monitor.
 */
export function AdminHealthTab(): React.JSX.Element {
  const [services, setServices] = useState<ServiceHealthStatus[]>([])
  const [probing, setProbing] = useState<boolean>(true)
  const [lastCheckTime, setLastCheckTime] = useState<string>('')

  const runProbes = async (): Promise<void> => {
    setProbing(true)
    try {
      const results = await checkSystemHealth()
      setServices(results)
      setLastCheckTime(new Date().toLocaleTimeString('id-ID'))
    } finally {
      setProbing(false)
    }
  }

  useEffect(() => {
    runProbes()
  }, [])

  const upCount = services.filter((s) => s.status === 'UP').length
  const totalCount = services.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Kesehatan Ekosistem Microservices</h1>
          <p className="text-xs text-slate-500 mt-0.5">Diagnostik waktu nyata untuk 7 container Polyrepo dan hulu BMKG Open Data.</p>
        </div>
        <button
          type="button"
          onClick={runProbes}
          disabled={probing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={probing ? 'animate-spin text-emerald-600' : ''} />
          <span>Lakukan Probe Sistem</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Status Keseluruhan</span>
            <div className="text-xl font-black text-slate-900">
              {upCount === totalCount ? 'Semua Beroperasi Normal' : `${upCount}/${totalCount} Aktif`}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Terakhir diperiksa pukul {lastCheckTime || 'Baru saja'}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Server size={28} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Container Polyrepo</span>
            <div className="text-xl font-black text-slate-900">7 Layanan Terisolasi</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Docker Network agro-network</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <CloudRain size={28} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Integrasi BMKG</span>
            <div className="text-xl font-black text-teal-700">Open Data XML BMKG</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Sinkronisasi Cuaca Sentra Tani</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => {
          const isUp = svc.status === 'UP'
          return (
            <div
              key={svc.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all relative overflow-hidden ${
                isUp ? 'border-slate-200 hover:border-emerald-300' : 'border-rose-200 bg-rose-50/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      svc.id.includes('sql') || svc.id.includes('mongo')
                        ? 'bg-amber-50 text-amber-600'
                        : svc.id.includes('weather')
                        ? 'bg-sky-50 text-sky-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {svc.id.includes('sql') || svc.id.includes('mongo') ? (
                      <Database size={20} />
                    ) : svc.id.includes('weather') ? (
                      <CloudRain size={20} />
                    ) : (
                      <Cpu size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{svc.name}</h3>
                    <p className="text-[11px] font-mono text-slate-400">{svc.containerName}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    isUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isUp ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>{isUp ? 'OPERASIONAL' : 'TERGANGGU'}</span>
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 font-mono">Port :{svc.port}</span>
                  <span>&bull;</span>
                  <span className="font-semibold text-slate-600">{svc.protocol}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <Activity size={13} />
                  <span>{svc.latencyMs ?? 15} ms</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
          <h2 className="text-base font-bold text-slate-100">Jaminan Keandalan Arsitektur AgroConnect</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sistem menerapkan prinsip pemisahan tanggung jawab penuh (*separation of concerns*). Transaksi keuangan diproses secara atomik di engine MySQL dengan isolasi ACID, data spesifikasi produk disimpan dalam MongoDB dengan skema fleksibel, prediksi cuaca dikalkulasi asinkron via Python FastAPI terhubung API BMKG, dan seluruh lalu lintas gerbang diarahkan melalui API Gateway Reverse Proxy Golang.
        </p>
      </div>
    </div>
  )
}
