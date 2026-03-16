import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { RealtimeReplies } from '@/components/forum/RealtimeReplies'
import { FORUM_CATEGORIES } from '@/lib/constants'

interface Props {
  params: Promise<{ threadId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { threadId } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('forum_threads').select('title').eq('id', threadId).single()
  return { title: data ? `${data.title} | PO Dads Forum` : 'Thread | PO Dads' }
}

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params
  const supabase = await createClient()

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('*, profiles(id, display_name, avatar_url)')
    .eq('id', threadId)
    .single()

  if (!thread) notFound()

  const { data: replies } = await supabase
    .from('forum_replies')
    .select('*, profiles(id, display_name, avatar_url)')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  const category = FORUM_CATEGORIES.find(c => c.slug === thread.category)
  const profile = thread.profiles

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/forum" className="flex items-center gap-1 text-gray-400 hover:text-[#2d6a4f] text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Forum
      </Link>

      {/* Thread header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {category.icon} {category.name}
            </span>
          )}
          {thread.pinned && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">📌 Pinned</span>
          )}
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-4">{thread.title}</h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center font-bold">
              {profile?.display_name?.[0]?.toUpperCase() ?? 'D'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">{profile?.display_name ?? 'A dad'}</p>
            <p className="text-xs text-gray-400">
              {format(new Date(thread.created_at), 'd MMM yyyy, HH:mm')}
            </p>
          </div>
        </div>

        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{thread.body}</div>
      </div>

      {/* Replies + form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare size={16} className="text-[#2d6a4f]" />
          {thread.reply_count} {thread.reply_count === 1 ? 'Reply' : 'Replies'}
        </h2>

        <RealtimeReplies
          threadId={threadId}
          authorId={thread.author_id}
          initialReplies={(replies as any) ?? []}
        />
      </div>
    </div>
  )
}
