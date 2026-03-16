'use client'
import { useState } from 'react'
import { Lightbulb, Send } from 'lucide-react'

interface Props {
  placeId: string
  onTipAdded?: () => void
}

export function TipForm({ placeId, onTipAdded }: Props) {
  const [tip, setTip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tip.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, tip: tip.trim() }),
      })
      if (res.status === 401) {
        window.location.href = '/auth/login'
        return
      }
      if (!res.ok) throw new Error()
      setTip('')
      onTipAdded?.()
    } catch {
      setError('Could not add tip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mt-4">
      <div className="flex-1 relative">
        <Lightbulb size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
        <input
          type="text"
          value={tip}
          onChange={e => setTip(e.target.value)}
          placeholder="Add a toddler tip (e.g. 'Best time to go is 10am')…"
          className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2d6a4f]"
          maxLength={200}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !tip.trim()}
        className="flex items-center gap-1 bg-[#f59e0b] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-[#d97706] transition-colors"
      >
        <Send size={13} />
        Add
      </button>
      {error && <p className="absolute text-red-500 text-xs mt-1">{error}</p>}
    </form>
  )
}
