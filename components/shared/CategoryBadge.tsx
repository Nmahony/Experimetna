import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

interface Props {
  categoryId: number | null
  className?: string
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
  pink: 'bg-pink-50 text-pink-700',
  orange: 'bg-orange-50 text-orange-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  purple: 'bg-purple-50 text-purple-700',
  red: 'bg-red-50 text-red-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  lime: 'bg-lime-50 text-lime-700',
}

export function CategoryBadge({ categoryId, className }: Props) {
  const cat = CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return null
  const colorClass = colorMap[cat.color] ?? 'bg-gray-50 text-gray-700'
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', colorClass, className)}>
      {cat.icon} {cat.name}
    </span>
  )
}
