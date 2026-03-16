'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Lightbulb, Trash2 } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import type { ToddlerTip } from '@/types'

interface Props {
  placeId: string
  tips: ToddlerTip[]
  currentUserId?: string
}

export function TipsSection({ placeId, tips: initialTips, currentUserId }: Props) {
  const [tips, setTips] = useState(initialTips)
  const [tipText, setTipText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipText.trim()) return
    setLoading(true)
    const res = await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place_id: placeId, tip: tipText }),
    })
    if (res.ok) {
      const newTip = await res.json()
      setTips(t => [newTip, ...t])
      setTipText('')
    }
    setLoading(false)
  }

  const deleteTip = async (tipId: string) => {
    await fetch('/api/tips', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tip_id: tipId }),
    })
    setTips(t => t.filter(tip => tip.id !== tipId))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">
        Quick, practical tips for visiting with toddlers — parking spots, best times to go, what to bring.
      </p>

      {currentUserId ? (
        <form onSubmit={submit} className="flex gap-2">
          <Input
            placeholder='e.g. "Best parking is the side entrance on Mill Road"'
            value={tipText}
            onChange={e => setTipText(e.target.value)}
            maxLength={200}
          />
          <Button type="submit" loading={loading} disabled={!tipText.trim()} size="sm">
            Add tip
          </Button>
        </form>
      ) : (
        <div className="bg-[var(--muted-bg)] rounded-xl p-4 text-center">
          <p className="text-[var(--muted)] text-sm mb-2">Sign in to share tips</p>
          <Link href="/auth/login" className="inline-flex items-center bg-[#2d6a4f] text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1b4332] transition-colors">Join the crew</Link>
        </div>
      )}

      {tips.length === 0 ? (
        <p className="text-[var(--muted)] text-sm text-center py-8">
          No tips yet — share what you know!
        </p>
      ) : (
        <div className="space-y-3">
          {tips.map(tip => (
            <div key={tip.id} className="flex items-start gap-3 bg-amber-50 rounded-xl p-3">
              <Lightbulb size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{tip.tip}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {(tip.profiles as any)?.display_name || (tip.profiles as any)?.username || 'A dad'} · {formatRelativeDate(tip.created_at)}
                </p>
              </div>
              {currentUserId === tip.user_id && (
                <button
                  onClick={() => deleteTip(tip.id)}
                  className="text-[var(--muted)] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
