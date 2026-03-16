'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, AREAS, FACILITIES } from '@/lib/constants'

export default function AddPlacePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: '',
    description: '',
    short_desc: '',
    category_id: '',
    area: 'Waterlooville',
    address: '',
    postcode: '',
    lat: '',
    lng: '',
    website: '',
    admission: '',
    min_age_months: '0',
    max_age_years: '10',
    is_free: false,
    is_indoor: false,
    is_dog_friendly: false,
    facilities: [] as string[],
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const toggleFacility = (key: string) => {
    setForm(f => ({
      ...f,
      facilities: f.facilities.includes(key)
        ? f.facilities.filter(k => k !== key)
        : [...f.facilities, key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/auth/login'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          category_id: form.category_id ? Number(form.category_id) : null,
          lat: form.lat ? Number(form.lat) : null,
          lng: form.lng ? Number(form.lng) : null,
          min_age_months: Number(form.min_age_months),
          max_age_years: Number(form.max_age_years),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to add place')
      }

      setSuccess(true)
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
        <h1 className="text-2xl font-bold mb-3">Sign in to add a place</h1>
        <p className="text-gray-500 mb-6">You need to be logged in to submit new places.</p>
        <Link href="/auth/login" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1b4332] transition-colors">
          Sign in
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold mb-3">Place submitted!</h1>
        <p className="text-gray-500 mb-6">Thanks! Your place will be reviewed and published shortly.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/places" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1b4332] transition-colors">
            Browse Places
          </Link>
          <button onClick={() => setSuccess(false)} className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Add a Place</h1>
        <p className="text-gray-500 mt-1">Share a great toddler-friendly spot with other Hampshire dads.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place name *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
              placeholder="e.g. Jubilee Park Playground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short description (1 line) *</label>
            <input
              required
              type="text"
              value={form.short_desc}
              onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
              placeholder="Headline summary for the card"
              maxLength={150}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#2d6a4f]"
              placeholder="Describe what makes this place great for toddlers…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white"
              >
                <option value="">Select…</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
              <select
                value={form.area}
                onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white"
              >
                {AREAS.filter(a => a !== 'All').map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Location</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
              placeholder="Street, Town"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
              <input
                type="text"
                value={form.postcode}
                onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
                placeholder="PO7 1AA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.lat}
                onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
                placeholder="50.8812"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.lng}
                onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
                placeholder="-1.0287"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admission</label>
              <input
                type="text"
                value={form.admission}
                onChange={e => setForm(f => ({ ...f, admission: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
                placeholder="Free / £5 adult"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min age (months)</label>
              <input
                type="number"
                min="0"
                value={form.min_age_months}
                onChange={e => setForm(f => ({ ...f, min_age_months: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max age (years)</label>
              <input
                type="number"
                min="0"
                max="18"
                value={form.max_age_years}
                onChange={e => setForm(f => ({ ...f, max_age_years: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            {(['is_free', 'is_indoor', 'is_dog_friendly'] as const).map(key => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-[#2d6a4f]"
                />
                <span className="text-sm text-gray-700">
                  {key === 'is_free' ? '🆓 Free entry' : key === 'is_indoor' ? '🏠 Indoor' : '🐕 Dog friendly'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {FACILITIES.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => toggleFacility(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.facilities.includes(f.key)
                    ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2d6a4f] text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Submitting…' : 'Submit Place'}
        </button>
      </form>
    </div>
  )
}
