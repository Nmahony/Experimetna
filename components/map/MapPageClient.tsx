'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CATEGORIES, AREAS } from '@/lib/constants'
import type { PlaceWithScores } from '@/types'

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => (
  <div className="flex-1 bg-[var(--muted-bg)] flex items-center justify-center rounded-2xl">
    <div className="text-center">
      <div className="text-4xl mb-2">🗺️</div>
      <p className="text-[var(--muted)]">Loading map...</p>
    </div>
  </div>
)})

interface Props {
  places: PlaceWithScores[]
}

export function MapPageClient({ places }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedArea, setSelectedArea] = useState<string>('All')

  const filtered = places.filter(p => {
    if (selectedCategory && p.category_id !== selectedCategory) return false
    if (selectedArea !== 'All' && p.area !== selectedArea) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-3 overflow-x-auto">
        <span className="text-sm font-medium text-[var(--muted)] whitespace-nowrap">
          {filtered.length} places
        </span>

        <div className="flex gap-2">
          {AREAS.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                selectedArea === area
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:bg-[var(--border)]'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[var(--border)]" />

        <div className="flex gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:bg-[var(--border)]'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <MapView places={filtered} />
      </div>
    </div>
  )
}
