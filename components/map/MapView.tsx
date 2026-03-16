'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { PlaceMarker } from './PlaceMarker'
import { MAP_CENTER } from '@/lib/constants'
import type { PlaceWithScores } from '@/types'

// Fix leaflet default icon path issue with webpack
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Props {
  places: PlaceWithScores[]
  center?: { lat: number; lng: number }
  zoom?: number
  singlePlace?: boolean
}

export default function MapView({ places, center = MAP_CENTER, zoom = 12, singlePlace = false }: Props) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {places.map(place => (
        <PlaceMarker key={place.id} place={place} />
      ))}
    </MapContainer>
  )
}
