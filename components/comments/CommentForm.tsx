'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  placeId: string
  onCommentAdded?: () => void
}

export function CommentForm({ placeId, onCommentAdded }: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, content: content.trim() }),
      })

      if (res.status === 401) {
        window.location.href = '/auth/login'
        return
      }
      if (!res.ok) throw new Error('Failed to post comment')

      setContent('')
      onCommentAdded?.()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Share your experience at this place…"
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 bg-[#2d6a4f] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-[#1b4332] transition-colors"
        >
          <Send size={14} />
          {loading ? 'Posting…' : 'Post comment'}
        </button>
      </div>
    </form>
  )
}
