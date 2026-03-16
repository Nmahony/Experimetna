import { PlaceCard } from './PlaceCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { PlaceWithScores } from '@/types'

interface Props {
  places: PlaceWithScores[]
}

export function PlaceGrid({ places }: Props) {
  if (places.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No places found"
        description="Try adjusting your filters or search term."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {places.map(place => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  )
}
