'use client'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'
import type { PlaceWithScores } from '@/types'

interface Props {
  place: PlaceWithScores
}

const categoryColors: Record<number, string> = {
  1: '#22c55e',  // playground
  2: '#16a34a',  // park
  3: '#d97706',  // cafe
  4: '#9333ea',  // soft-play
  5: '#ca8a04',  // farm
  6: '#0ea5e9',  // beach
  7: '#64748b',  // museum
  8: '#ef4444',  // sports
  9: '#8b5cf6',  // library
  10: '#84cc16', // garden
}

function createCategoryIcon(categoryId: number | null): L.DivIcon {
  const color = categoryId ? (categoryColors[categoryId] ?? '#2d6a4f') : '#2d6a4f'
  const cat = CATEGORIES.find(c => c.id === categoryId)
  const icon = cat?.icon ?? '📍'

  return L.divIcon({
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">${icon}</span>
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  })
}

export function PlaceMarker({ place }: Props) {
  if (!place.lat || !place.lng) return null

  const icon = createCategoryIcon(place.category_id)

  return (
    <Marker position={[place.lat, place.lng]} icon={icon}>
      <Popup className="place-popup" minWidth={200}>
        <div className="p-1">
          <p className="font-bold text-sm text-gray-900 mb-1">{place.name}</p>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{place.short_desc}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{place.area}</span>
            <span className="text-xs font-semibold text-[#2d6a4f]">
              👍 {place.vote_score ?? 0}
            </span>
          </div>
          <a
            href={`/places/${place.slug}`}
            className="block text-center bg-[#2d6a4f] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1b4332] transition-colors"
          >
            View details →
          </a>
        </div>
      </Popup>
    </Marker>
  )
}
