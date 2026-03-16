'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { FORUM_CATEGORIES } from '@/lib/constants'

export default function NewThreadPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', body: '', category: 'general' })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/auth/login'); return }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to create thread')

      const data = await res.json()
      router.push(`/forum/${data.id}`)
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
        <h1 className="text-2xl font-bold mb-3">Sign in to post</h1>
        <p className="text-gray-500 mb-6">You need to be logged in to start a thread.</p>
        <Link href="/auth/login" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/forum" className="flex items-center gap-1 text-gray-400 hover:text-[#2d6a4f] text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Forum
      </Link>

      <h1 className="text-3xl font-black text-gray-900 mb-6">Start a Thread</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {FORUM_CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setForm(f => ({ ...f, category: cat.slug }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.category === cat.slug
                    ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            required
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            placeholder="What's on your mind?"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post *</label>
          <textarea
            required
            rows={8}
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#2d6a4f]"
            placeholder="Share your thoughts, questions, or experience…"
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
          {loading ? 'Posting…' : 'Post Thread'}
        </button>
      </form>
    </div>
  )
}
