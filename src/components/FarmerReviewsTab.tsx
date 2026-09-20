import React, { useState } from 'react'
import { Star, ShieldCheck, ThumbsUp, Calendar, Tag, MessageSquare } from 'lucide-react'
import { FarmerReview } from '../types/farmer'

/**
 * FarmerReviewsTabProps defines review data feed and overall satisfaction scoring.
 */
export interface FarmerReviewsTabProps {
  reviews: FarmerReview[]
  overallRating: number
  totalReviews: number
}

/**
 * FarmerReviewsTab presents customer feedback, star rating distribution, and helpfulness metrics.
 *
 * @param props - Review dataset and satisfaction summary numbers.
 * @returns JSX Element rendering review breakdown and testimonial list.
 */
export function FarmerReviewsTab(props: FarmerReviewsTabProps): React.JSX.Element {
  const { reviews, overallRating, totalReviews } = props
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all')
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({})

  const handleHelpfulClick = (reviewId: string, initialCount: number): void => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1
    }))
  }

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === 'all') return true
    return r.rating === selectedFilter
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 text-center">
            <span className="text-4xl sm:text-5xl font-black text-slate-900">{overallRating}</span>
            <div className="flex items-center gap-1 my-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(overallRating) ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Berdasarkan {totalReviews} ulasan pembeli terverifikasi
            </span>
          </div>

          <div className="md:col-span-8 space-y-2 max-w-lg mx-auto md:mx-0 w-full">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stars === 5 ? 86 : stars === 4 ? 12 : stars === 3 ? 2 : 0
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-16 text-slate-600 font-semibold shrink-0">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{stars} Bintang</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${count}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-medium">{count}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-emerald-700" />
          <h3 className="font-black text-slate-900 text-base">Ulasan Panen Terverifikasi</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {filteredReviews.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua Ulasan
          </button>
          {[5, 4, 3].map((starVal) => (
            <button
              key={starVal}
              type="button"
              onClick={() => setSelectedFilter(starVal)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === starVal
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{starVal}</span>
              <Star size={11} className={selectedFilter === starVal ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Belum ada ulasan untuk filter bintang yang dipilih.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const currentHelpful = helpfulCounts[rev.id] ?? rev.helpful_count
            const initials = rev.buyer_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <div
                key={rev.id}
                className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{rev.buyer_name}</span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck size={11} />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={11} />
                          <span>{rev.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 self-start sm:self-auto text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/70">
                    <Tag size={11} className="text-emerald-600" />
                    <span>{rev.product_name}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-12">
                  {rev.comment}
                </p>

                <div className="flex items-center justify-end pt-1 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id, rev.helpful_count)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <ThumbsUp size={12} />
                    <span>Membantu ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
