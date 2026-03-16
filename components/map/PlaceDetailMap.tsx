'use client'
import dynamic from 'next/dynamic'
import type { PlaceWithScores } from '@/types'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

interface Props {
  place: PlaceWithScores
}

export function PlaceDetailMap({ place }: Props) {
  return (
    <MapView
      places={[place]}
      center={{ lat: Number(place.lat), lng: Number(place.lng) }}
      zoom={15}
      singlePlace
    />
  )
}
