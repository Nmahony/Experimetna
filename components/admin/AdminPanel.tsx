'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

interface Props {
  pendingPlaces: any[]
  pendingComments: any[]
}

export function AdminPanel({ pendingPlaces: initialPlaces, pendingComments: initialComments }: Props) {
  const [places, setPlaces] = useState(initialPlaces)
  const [comments, setComments] = useState(initialComments)
  const supabase = createClient()

  const approvePlace = async (id: string) => {
    await supabase.from('places').update({ approved: true }).eq('id', id)
    setPlaces(p => p.filter(place => place.id !== id))
  }

  const rejectPlace = async (id: string) => {
    await supabase.from('places').delete().eq('id', id)
    setPlaces(p => p.filter(place => place.id !== id))
  }

  const approveComment = async (id: string) => {
    await supabase.from('comments').update({ approved: true }).eq('id', id)
    setComments(c => c.filter(comment => comment.id !== id))
  }

  const deleteComment = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    setComments(c => c.filter(comment => comment.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Pending places */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Pending Places ({places.length})
        </h2>
        {places.length === 0 ? (
          <p className="text-[var(--muted)] text-sm bg-[var(--muted-bg)] rounded-xl p-4">All clear — no pending places.</p>
        ) : (
          <div className="space-y-3">
            {places.map((place: any) => (
              <div key={place.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{place.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{place.area} · Submitted by {place.profiles?.display_name || place.profiles?.username}</p>
                    <p className="text-sm mt-1 line-clamp-2">{place.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="default" onClick={() => approvePlace(place.id)}>
                      <Check size={14} /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectPlace(place.id)}>
                      <X size={14} /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending comments */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Flagged Comments ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-[var(--muted)] text-sm bg-[var(--muted-bg)] rounded-xl p-4">All clear — no flagged comments.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment: any) => (
              <div key={comment.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      On <Link href={`/places/${comment.places?.slug}`} className="text-[var(--primary)] hover:underline">{comment.places?.name}</Link>
                    </p>
                    <p className="text-sm text-[var(--muted)]">by {comment.profiles?.display_name || comment.profiles?.username}</p>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="default" onClick={() => approveComment(comment.id)}>
                      <Check size={14} /> Keep
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteComment(comment.id)}>
                      <X size={14} /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
