import Link from 'next/link'
import { MessageSquare, Pin } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import { FORUM_CATEGORIES } from '@/lib/constants'
import type { ForumThread } from '@/types'

interface Props {
  thread: ForumThread
}

export function ThreadCard({ thread }: Props) {
  const category = FORUM_CATEGORIES.find(c => c.slug === thread.category)
  const profile = thread.profiles

  return (
    <Link href={`/forum/${thread.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:border-[#2d6a4f]/30 hover:shadow-sm transition-all">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-sm font-bold">
                {profile?.display_name?.[0]?.toUpperCase() ?? 'D'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {thread.pinned && <Pin size={12} className="text-[#f59e0b] flex-shrink-0" />}
              {category && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {category.icon} {category.name}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#2d6a4f] transition-colors line-clamp-2 mb-1">
              {thread.title}
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-3">
              <span>{profile?.display_name ?? 'A dad'}</span>
              <span>·</span>
              <span>{formatRelativeDate(thread.created_at)}</span>
              {thread.reply_count > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={11} /> {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
