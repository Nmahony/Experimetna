'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AREAS } from '@/lib/constants'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
}

export function AddPlaceForm({ categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', category_id: '',
    area: 'Waterlooville', address: '', postcode: '',
    lat: '', lng: '', website: '', admission: '',
    is_free: false, is_indoor: false, is_dog_friendly: false,
  })

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        min_age_months: 0,
        max_age_years: 10,
      }),
    })
    if (res.ok) {
      router.push('/places?submitted=1')
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
    setLoading(false)
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={form[key as keyof typeof form] as string}
        onChange={e => set(key, e.target.value)}
      />
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
        🔍 Your submission will be reviewed by our team before going live. Usually within 24 hours.
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg">Basic Info</h2>
        {field('Place name *', 'name', 'text', 'e.g. Jubilee Park Playground')}
        <div>
          <label className="block text-sm font-medium mb-1.5">Description *</label>
          <Textarea
            placeholder="Tell other dads what to expect, what's great about it, any tips..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select
            className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
            value={form.category_id}
            onChange={e => set('category_id', e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Area *</label>
          <select
            className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
            value={form.area}
            onChange={e => set('area', e.target.value)}
          >
            {AREAS.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg">Location</h2>
        {field('Address', 'address', 'text', 'e.g. London Road, Waterlooville')}
        {field('Postcode', 'postcode', 'text', 'e.g. PO7 7DT')}
        <div className="grid grid-cols-2 gap-4">
          {field('Latitude *', 'lat', 'number', '50.8812')}
          {field('Longitude *', 'lng', 'number', '-1.0287')}
        </div>
        <p className="text-xs text-[var(--muted)]">
          Tip: Find coordinates by right-clicking on Google Maps and selecting "What's here?"
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg">Details</h2>
        {field('Website', 'website', 'url', 'https://...')}
        {field('Admission / Pricing', 'admission', 'text', 'e.g. Free or £5 adults, free under 3')}
        <div className="flex flex-col gap-3">
          {[
            { key: 'is_free', label: 'Free to enter' },
            { key: 'is_indoor', label: 'Indoor activity' },
            { key: 'is_dog_friendly', label: 'Dog friendly' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={e => set(key, e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--primary)]"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Submit for review
      </Button>
    </form>
  )
}
