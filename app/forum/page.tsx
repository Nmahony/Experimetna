import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ThreadList } from '@/components/forum/ThreadList'
import { FORUM_CATEGORIES } from '@/lib/constants'

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function ForumPage({ searchParams }: Props) {
  const { category = 'all' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('forum_threads')
    .select('*, profiles(id, display_name, avatar_url)')
    .order('pinned', { ascending: false })
    .order('last_reply_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: threads } = await query

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dad Chat</h1>
          <p className="text-gray-500 mt-1">The PO Dads community forum</p>
        </div>
        <Link
          href="/forum/new"
          className="flex items-center gap-2 bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1b4332] transition-colors"
        >
          <Plus size={16} />
          New Thread
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/forum"
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            category === 'all'
              ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
          }`}
        >
          All
        </Link>
        {FORUM_CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/forum?category=${cat.slug}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1 ${
              category === cat.slug
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      <ThreadList threads={(threads as any) ?? []} />
    </div>
  )
}
