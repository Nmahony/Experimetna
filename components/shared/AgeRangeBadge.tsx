import { cn } from '@/lib/utils'

interface Props {
  minMonths: number
  maxYears: number
  className?: string
}

export function AgeRangeBadge({ minMonths, maxYears, className }: Props) {
  const minStr = minMonths === 0 ? 'Birth' : minMonths < 12 ? `${minMonths}mo` : `${Math.floor(minMonths / 12)}yr`
  const label = `${minStr}–${maxYears}yr`
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full', className)}>
      👶 {label}
    </span>
  )
}
