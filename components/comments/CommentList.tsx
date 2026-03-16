import { CommentCard } from './CommentCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Comment } from '@/types'

interface Props {
  comments: Comment[]
}

export function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="No comments yet"
        description="Be the first dad to share your experience!"
      />
    )
  }
  const sorted = [...comments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  return (
    <div>
      {sorted.map(c => <CommentCard key={c.id} comment={c} />)}
    </div>
  )
}
