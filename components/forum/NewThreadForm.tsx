'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FORUM_CATEGORIES } from '@/lib/constants'

export function NewThreadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', body: '', category: 'general' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const thread = await res.json()
      router.push(`/forum/${thread.id}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <div className="flex flex-wrap gap-2">
          {FORUM_CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setForm(f => ({ ...f, category: cat.slug }))}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                form.category === cat.slug
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:bg-[var(--border)]'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Title *</label>
        <Input
          placeholder="What do you want to talk about?"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Body *</label>
        <Textarea
          placeholder="Share your thoughts, question or experience..."
          value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          rows={8}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={loading} size="lg" disabled={!form.title.trim() || !form.body.trim()}>
        Post thread
      </Button>
    </form>
  )
}
