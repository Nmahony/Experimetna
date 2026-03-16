'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Place } from '@/types'

export default function NewMeetupPage() {
  const [user, setUser] = useState<any>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    place_id: '',
    meetup_date: '',
    meetup_time: '',
    max_attendees: '',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    supabase
      .from('places')
      .select('id, name, area')
      .eq('approved', true)
      .order('name')
      .then(({ data }) => setPlaces((data as Place[]) ?? []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/auth/login'); return }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/meetups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          place_id: form.place_id || null,
          max_attendees: form.max_attendees ? Number(form.max_attendees) : null,
        }),
      })
      if (!res.ok) throw new Error('Failed to create meetup')
      const data = await res.json()
      router.push(`/meetups/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔐</p>
        <h1 className="text-2xl font-bold mb-3">Sign in to organise a meetup</h1>
        <Link href="/auth/login" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold">Sign in</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/meetups" className="flex items-center gap-1 text-gray-400 hover:text-[#2d6a4f] text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> All Meetups
      </Link>

      <h1 className="text-3xl font-black text-gray-900 mb-6">Organise a Meetup</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            required
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            placeholder="e.g. Morning walk at Staunton Country Park"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#2d6a4f]"
            placeholder="Tell people what to expect…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Place (optional)</label>
          <select
            value={form.place_id}
            onChange={e => setForm(f => ({ ...f, place_id: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white"
          >
            <option value="">Select a place…</option>
            {places.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({(p as any).area})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              required
              type="date"
              value={form.meetup_date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, meetup_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={form.meetup_time}
              onChange={e => setForm(f => ({ ...f, meetup_time: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max attendees (optional)</label>
          <input
            type="number"
            min="2"
            value={form.max_attendees}
            onChange={e => setForm(f => ({ ...f, max_attendees: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            placeholder="Leave blank for unlimited"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2d6a4f] text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Creating…' : 'Create Meetup'}
        </button>
      </form>
    </div>
  )
}
