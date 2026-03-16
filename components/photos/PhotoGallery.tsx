'use client'
import { useState } from 'react'
import { PhotoLightbox } from './PhotoLightbox'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Photo } from '@/types'

interface Props {
  photos: Photo[]
  supabaseUrl: string
}

export function PhotoGallery({ photos, supabaseUrl }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <EmptyState
        icon="📷"
        title="No photos yet"
        description="Upload the first photo of this place!"
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.map((photo, i) => {
          const url = `${supabaseUrl}/storage/v1/object/public/place-photos/${photo.storage_key}`
          return (
            <button
              key={photo.id}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
            >
              <img
                src={url}
                alt={photo.caption ?? ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          )
        })}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          supabaseUrl={supabaseUrl}
        />
      )}
    </>
  )
}
