import { formatRelativeDate } from '@/lib/utils'
import type { Comment } from '@/types'

interface Props {
  comment: Comment
}

export function CommentCard({ comment }: Props) {
  const profile = comment.profiles
  const initials = profile?.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt=""
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-900">
            {profile?.display_name ?? 'Dad'}
          </span>
          <span className="text-xs text-gray-400">{formatRelativeDate(comment.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  )
}
