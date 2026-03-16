'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  places: { id: string; name: string; area: string }[]
}

export function NewMeetupForm({ places }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', place_id: '',
    meetup_date: '', meetup_time: '', max_attendees: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/meetups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        place_id: form.place_id || null,
        max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
      }),
    })
    if (res.ok) {
      const meetup = await res.json()
      router.push(`/meetups/${meetup.id}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
    setLoading(false)
  }

  // Get tomorrow as the min date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Meetup name *</label>
        <Input
          placeholder='e.g. "Saturday morning at Staunton Country Park"'
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <Textarea
          placeholder="What's the plan? What should people bring? Any age restrictions?"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Date *</label>
          <Input type="date" min={minDate} value={form.meetup_date} onChange={e => set('meetup_date', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Time</label>
          <Input type="time" value={form.meetup_time} onChange={e => set('meetup_time', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Location</label>
        <select
          className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
          value={form.place_id}
          onChange={e => set('place_id', e.target.value)}
        >
          <option value="">Select a place (optional)</option>
          {places.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.area})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Max attendees</label>
        <Input
          type="number"
          placeholder="Leave blank for no limit"
          value={form.max_attendees}
          onChange={e => set('max_attendees', e.target.value)}
          min={1}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={loading} size="lg" className="w-full" disabled={!form.title.trim() || !form.meetup_date}>
        Create meetup
      </Button>
    </form>
  )
}
