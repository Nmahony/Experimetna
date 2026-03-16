'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Filter, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, AREAS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PlaceWithScores } from '@/types'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="text-5xl mb-3">🗺️</div>
        <p className="text-gray-500 text-sm">Loading map…</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  const [places, setPlaces] = useState<PlaceWithScores[]>([])
  const [filtered, setFiltered] = useState<PlaceWithScores[]>([])
  const [loading, setLoading] = useState(true)
  const [area, setArea] = useState('All')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('places_with_scores')
      .select('*, categories(*)')
      .eq('approved', true)
      .not('lat', 'is', null)
      .then(({ data }) => {
        const p = (data as PlaceWithScores[]) ?? []
        setPlaces(p)
        setFiltered(p)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = [...places]
    if (area !== 'All') result = result.filter(p => p.area === area)
    if (categoryId !== null) result = result.filter(p => p.category_id === categoryId)
    setFiltered(result)
  }, [places, area, categoryId])

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col">
      {/* Filter bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 z-10">
        <MapPin size={16} className="text-[#2d6a4f]" />
        <span className="text-sm font-semibold text-gray-700">{filtered.length} places</span>

        <div className="flex-1 overflow-x-auto flex items-center gap-2 scrollbar-hide">
          {AREAS.map(a => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={cn(
                'whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition-all flex-shrink-0',
                area === a
                  ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
              )}
            >
              {a}
            </button>
          ))}
          <div className="w-px h-4 bg-gray-200 flex-shrink-0 mx-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
              className={cn(
                'whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition-all flex-shrink-0',
                categoryId === cat.id
                  ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        {!loading && (
          <MapView places={filtered} />
        )}
      </div>
    </div>
  )
}
