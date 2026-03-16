import Link from 'next/link'
import { ThumbsUp, Eye, MessageCircle, Home, Dog } from 'lucide-react'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { AgeRangeBadge } from '@/components/shared/AgeRangeBadge'
import type { PlaceWithScores } from '@/types'

interface Props {
  place: PlaceWithScores
}

const GRADIENT_FALLBACKS = [
  'from-green-400 to-emerald-600',
  'from-blue-400 to-cyan-600',
  'from-amber-400 to-orange-500',
  'from-purple-400 to-violet-600',
  'from-pink-400 to-rose-500',
]

export function PlaceCard({ place }: Props) {
  const gradient = GRADIENT_FALLBACKS[place.name.charCodeAt(0) % GRADIENT_FALLBACKS.length]

  return (
    <Link href={`/places/${place.slug}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
        {/* Cover image */}
        <div className="relative h-44 overflow-hidden">
          {place.cover_image_url ? (
            <img
              src={place.cover_image_url}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-4xl opacity-60">
                {place.is_indoor ? '🏠' : place.area === 'Havant' ? '🌊' : place.area === 'Fareham' ? '🏰' : '🌿'}
              </span>
            </div>
          )}
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {place.is_free && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>
            )}
            {place.is_indoor && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Home size={10} /> Indoor
              </span>
            )}
          </div>
          {/* Area badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              {place.area}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <CategoryBadge categoryId={place.category_id} />
          </div>
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-[#2d6a4f] transition-colors line-clamp-1">
            {place.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
            {place.short_desc || place.description?.slice(0, 100)}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <ThumbsUp size={12} className="text-[#2d6a4f]" />
                <span className="font-semibold text-gray-700">{place.vote_score ?? 0}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {place.visit_count ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {place.comment_count ?? 0}
              </span>
            </div>
            <AgeRangeBadge minMonths={place.min_age_months} maxYears={place.max_age_years} />
          </div>
        </div>
      </div>
    </Link>
  )
}
