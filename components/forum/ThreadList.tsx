import { ThreadCard } from './ThreadCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ForumThread } from '@/types'

interface Props {
  threads: ForumThread[]
}

export function ThreadList({ threads }: Props) {
  if (threads.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="No threads yet"
        description="Start the conversation - be the first to post!"
      />
    )
  }

  const pinned = threads.filter(t => t.pinned)
  const regular = threads.filter(t => !t.pinned)

  return (
    <div className="space-y-2">
      {pinned.map(t => <ThreadCard key={t.id} thread={t} />)}
      {regular.map(t => <ThreadCard key={t.id} thread={t} />)}
    </div>
  )
}
