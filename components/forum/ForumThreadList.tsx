import Link from 'next/link'
import { MessageSquare, Pin } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import { FORUM_CATEGORIES } from '@/lib/constants'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ForumThread } from '@/types'

interface Props {
  threads: ForumThread[]
}

export function ForumThreadList({ threads }: Props) {
  if (threads.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="No threads yet"
        description="Be the first to start a conversation!"
      />
    )
  }

  return (
    <div className="space-y-2">
      {threads.map(thread => {
        const cat = FORUM_CATEGORIES.find(c => c.slug === thread.category)
        return (
          <Link key={thread.id} href={`/forum/${thread.id}`} className="block group">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] px-4 py-4 hover:border-[var(--primary)] transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {thread.pinned && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Pin size={11} /> Pinned
                      </span>
                    )}
                    {cat && (
                      <span className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] rounded-full px-2 py-0.5">
                        {cat.icon} {cat.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    by {(thread.profiles as any)?.display_name || (thread.profiles as any)?.username || 'A dad'}
                    {' · '}{formatRelativeDate(thread.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--muted)] flex-shrink-0">
                  <MessageSquare size={14} />
                  <span>{thread.reply_count}</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
