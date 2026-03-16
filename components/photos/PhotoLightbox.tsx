'use client'
import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '@/types'

interface Props {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  supabaseUrl: string
}

export function PhotoLightbox({ photos, currentIndex, onClose, onNavigate, supabaseUrl }: Props) {
  const photo = photos[currentIndex]

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1)
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, photos.length])

  if (!photo) return null

  const imageUrl = `${supabaseUrl}/storage/v1/object/public/place-photos/${photo.storage_key}`

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2">
        <X size={24} />
      </button>

      {currentIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2 bg-black/30 rounded-full"
          onClick={e => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <img
        src={imageUrl}
        alt={photo.caption ?? ''}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
        onClick={e => e.stopPropagation()}
      />

      {currentIndex < photos.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2 bg-black/30 rounded-full"
          onClick={e => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {photo.caption && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full">
          {photo.caption}
        </div>
      )}

      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
