'use client'
import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  placeId: string
  initialSaved: boolean
}

export function SaveButton({ placeId, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const wasSaved = saved
    setSaved(!saved)

    try {
      const res = await fetch('/api/saved', {
        method: wasSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      })
      if (res.status === 401) {
        setSaved(wasSaved)
        window.location.href = '/auth/login'
      } else if (!res.ok) throw new Error()
    } catch {
      setSaved(wasSaved)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all border',
        saved
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600'
      )}
      aria-label={saved ? 'Remove from saved' : 'Save place'}
    >
      {saved ? <BookmarkCheck size={15} className="fill-amber-500 text-amber-500" /> : <Bookmark size={15} />}
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
