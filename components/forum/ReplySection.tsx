'use client'

import { useState, useEffect } from 'react'
import { formatRelativeDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { ForumReply } from '@/types'

interface Props {
  threadId: string
  locked: boolean
  initialReplies: ForumReply[]
  currentUserId?: string
}

export function ReplySection({ threadId, locked, initialReplies, currentUserId }: Props) {
  const [replies, setReplies] = useState(initialReplies)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Realtime subscription for new replies
  useEffect(() => {
    const channel = supabase
      .channel(`forum_replies_${threadId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'forum_replies',
        filter: `thread_id=eq.${threadId}`,
      }, async (payload) => {
        // Fetch with profile data
        const { data } = await supabase
          .from('forum_replies')
          .select('*, profiles(username, display_name, avatar_url)')
          .eq('id', payload.new.id)
          .single()
        if (data) {
          setReplies(r => {
            if (r.some(reply => reply.id === data.id)) return r
            return [...r, data]
          })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [threadId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    const res = await fetch('/api/forum/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, body }),
    })
    if (res.ok) setBody('')
    setLoading(false)
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </h2>

      <div className="space-y-4 mb-8">
        {replies.length === 0 ? (
          <p className="text-[var(--muted)] text-sm text-center py-8">
            No replies yet — jump in!
          </p>
        ) : (
          replies.map((reply, i) => (
            <div key={reply.id} className={`flex gap-3 ${i % 2 === 0 ? '' : 'ml-4'}`}>
              <div className="h-8 w-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                {((reply.profiles as any)?.display_name || (reply.profiles as any)?.username || 'D')[0].toUpperCase()}
              </div>
              <div className="flex-1 bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-semibold text-sm">
                    {(reply.profiles as any)?.display_name || (reply.profiles as any)?.username || 'A dad'}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{formatRelativeDate(reply.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {!locked && (
        currentUserId ? (
          <form onSubmit={submit} className="space-y-3">
            <h3 className="font-semibold">Add your reply</h3>
            <Textarea
              placeholder="What do you think?"
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
            />
            <Button type="submit" loading={loading} disabled={!body.trim()}>
              Post reply
            </Button>
          </form>
        ) : (
          <div className="bg-[var(--muted-bg)] rounded-xl p-6 text-center">
            <p className="text-[var(--muted)] mb-3">Sign in to join the conversation</p>
            <Button asChild><Link href="/auth/login">Join the crew</Link></Button>
          </div>
        )
      )}
      {locked && (
        <div className="bg-[var(--muted-bg)] rounded-xl p-4 text-center text-sm text-[var(--muted)]">
          🔒 This thread is locked
        </div>
      )}
    </div>
  )
}
