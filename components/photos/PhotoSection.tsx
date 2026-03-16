'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Photo } from '@/types'

interface Props {
  placeId: string
  photos: Photo[]
  currentUserId?: string
}

export function PhotoSection({ placeId, photos: initialPhotos, currentUserId }: Props) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('place_id', placeId)

    const res = await fetch('/api/uploads', { method: 'POST', body: formData })
    if (res.ok) {
      const newPhoto = await res.json()
      setPhotos(p => [newPhoto, ...p])
    }
    setUploading(false)
  }

  const getPhotoUrl = (photo: Photo) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/place-photos/${photo.storage_key}`
  }

  return (
    <div className="space-y-4">
      {currentUserId ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }}
          />
          <Button
            variant="outline"
            size="sm"
            loading={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={14} />
            Upload a photo
          </Button>
        </div>
      ) : (
        <div className="bg-[var(--muted-bg)] rounded-xl p-4 text-center">
          <p className="text-[var(--muted)] text-sm mb-2">Sign in to share photos</p>
          <Link href="/auth/login" className="inline-flex items-center bg-[#2d6a4f] text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1b4332] transition-colors">Join the crew</Link>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-[var(--muted)] text-sm text-center py-8">
          No photos yet — be the first to share what it looks like!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map(photo => (
            <button
              key={photo.id}
              onClick={() => setLightbox(getPhotoUrl(photo))}
              className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
            >
              <img
                src={getPhotoUrl(photo)}
                alt={photo.caption || 'Place photo'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <img
            src={lightbox}
            alt="Photo"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
