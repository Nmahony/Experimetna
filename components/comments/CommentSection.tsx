'use client'

import { useState } from 'react'
import { formatRelativeDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import type { Comment } from '@/types'

interface Props {
  placeId: string
  comments: Comment[]
  currentUserId?: string
}

export function CommentSection({ placeId, comments: initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place_id: placeId, content: body }),
    })
    if (res.ok) {
      const newComment = await res.json()
      setComments(c => [newComment, ...c])
      setBody('')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {currentUserId ? (
        <form onSubmit={submit} className="space-y-3">
          <Textarea
            placeholder="Share your experience — what was it like with your toddler?"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
          />
          <Button type="submit" loading={loading} disabled={!body.trim()}>
            Post comment
          </Button>
        </form>
      ) : (
        <div className="bg-[var(--muted-bg)] rounded-xl p-4 text-center">
          <p className="text-[var(--muted)] text-sm mb-3">Sign in to leave a comment</p>
          <Link href="/auth/login" className="inline-flex items-center bg-[#2d6a4f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1b4332] transition-colors">
            Join the crew
          </Link>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-[var(--muted)] text-sm text-center py-8">
          No comments yet — be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {((comment.profiles as any)?.display_name || (comment.profiles as any)?.username || 'D')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {(comment.profiles as any)?.display_name || (comment.profiles as any)?.username || 'A dad'}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{formatRelativeDate(comment.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
