import { formatRelativeDate } from '@/lib/utils'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ToddlerTip } from '@/types'

interface Props {
  tips: ToddlerTip[]
}

export function TipsList({ tips }: Props) {
  if (tips.length === 0) {
    return (
      <EmptyState
        icon="💡"
        title="No tips yet"
        description="Share a toddler-friendly tip for this place!"
      />
    )
  }

  return (
    <ul className="space-y-3">
      {tips.map(tip => (
        <li key={tip.id} className="flex gap-3 bg-amber-50 rounded-xl px-4 py-3">
          <span className="text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-sm text-gray-800 leading-relaxed">{tip.tip}</p>
            <p className="text-xs text-gray-400 mt-1">
              {tip.profiles?.display_name ?? 'A dad'} · {formatRelativeDate(tip.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
