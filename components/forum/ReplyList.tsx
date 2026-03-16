import { ReplyCard } from './ReplyCard'
import type { ForumReply } from '@/types'

interface Props {
  replies: ForumReply[]
  authorId?: string
}

export function ReplyList({ replies, authorId }: Props) {
  return (
    <div>
      {replies.map(reply => (
        <ReplyCard key={reply.id} reply={reply} isOp={reply.author_id === authorId} />
      ))}
    </div>
  )
}
