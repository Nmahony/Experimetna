import { cn } from '@/lib/utils'
import { FACILITIES } from '@/lib/constants'

interface Props {
  facilityKey: string
  className?: string
}

export function FacilityBadge({ facilityKey, className }: Props) {
  const facility = FACILITIES.find(f => f.key === facilityKey)
  const label = facility?.label ?? facilityKey.replace(/_/g, ' ')
  const icon = facility?.icon ?? '•'
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full', className)}>
      {icon} {label}
    </span>
  )
}
