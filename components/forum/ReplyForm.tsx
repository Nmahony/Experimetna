'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  threadId: string
  onReplyAdded?: () => void
}

export function ReplyForm({ threadId, onReplyAdded }: Props) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, body: body.trim() }),
      })
      if (res.status === 401) {
        window.location.href = '/auth/login'
        return
      }
      if (!res.ok) throw new Error()
      setBody('')
      onReplyAdded?.()
    } catch {
      setError('Failed to post reply. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Post a reply</h3>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="What do you think? Share your thoughts…"
        rows={4}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] bg-white"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="flex items-center gap-2 bg-[#2d6a4f] text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-[#1b4332] transition-colors"
        >
          <Send size={14} />
          {loading ? 'Posting…' : 'Post reply'}
        </button>
      </div>
    </form>
  )
}
