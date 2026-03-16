import { formatRelativeDate } from '@/lib/utils'
import type { ForumReply } from '@/types'

interface Props {
  reply: ForumReply
  isOp?: boolean
}

export function ReplyCard({ reply, isOp }: Props) {
  const profile = reply.profiles

  return (
    <div className="flex gap-3 py-5 border-b border-gray-100 last:border-0">
      {profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {profile?.display_name?.[0]?.toUpperCase() ?? 'D'}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm text-gray-900">{profile?.display_name ?? 'A dad'}</span>
          {isOp && (
            <span className="text-xs bg-[#2d6a4f] text-white px-1.5 py-0.5 rounded-full">OP</span>
          )}
          <span className="text-xs text-gray-400">{formatRelativeDate(reply.created_at)}</span>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.body}</div>
      </div>
    </div>
  )
}
