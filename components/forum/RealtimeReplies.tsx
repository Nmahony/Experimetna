'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ReplyList } from './ReplyList'
import { ReplyForm } from './ReplyForm'
import type { ForumReply } from '@/types'

interface Props {
  threadId: string
  authorId: string
  initialReplies: ForumReply[]
}

export function RealtimeReplies({ threadId, authorId, initialReplies }: Props) {
  const [replies, setReplies] = useState<ForumReply[]>(initialReplies)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`forum-replies-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_replies',
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          // Fetch full reply with profile
          const { data } = await supabase
            .from('forum_replies')
            .select('*, profiles(id, display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setReplies(prev => {
              // Avoid duplicates
              if (prev.some(r => r.id === data.id)) return prev
              return [...prev, data]
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [threadId])

  const refresh = async () => {
    const { data } = await supabase
      .from('forum_replies')
      .select('*, profiles(id, display_name, avatar_url)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (data) setReplies(data)
  }

  return (
    <>
      <ReplyList replies={replies} authorId={authorId} />
      <ReplyForm threadId={threadId} onReplyAdded={refresh} />
    </>
  )
}
