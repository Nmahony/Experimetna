'use client'

import dynamic from 'next/dynamic'

const MiniMapInner = dynamic(() => import('./MiniMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-[var(--muted-bg)] rounded-xl flex items-center justify-center">
      <span className="text-[var(--muted)] text-sm">Loading map...</span>
    </div>
  ),
})

interface Props {
  lat: number
  lng: number
  name: string
}

export function MiniMap({ lat, lng, name }: Props) {
  return <MiniMapInner lat={lat} lng={lng} name={name} />
}
