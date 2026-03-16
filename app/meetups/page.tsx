import Link from 'next/link'
import { Plus, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MeetupCard } from '@/components/meetups/MeetupCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Meetup } from '@/types'

export default async function MeetupsPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: meetups } = await supabase
    .from('meetups')
    .select('*, profiles(id, display_name, avatar_url), places(id, name, slug)')
    .gte('meetup_date', today)
    .order('meetup_date', { ascending: true })

  // Get RSVP counts
  const meetupsWithCounts: Meetup[] = await Promise.all(
    (meetups ?? []).map(async (m) => {
      const { count } = await supabase
        .from('meetup_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('meetup_id', m.id)
      return { ...m, rsvp_count: count ?? 0 }
    })
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Meetups</h1>
          <p className="text-gray-500 mt-1">Get out there with your little one</p>
        </div>
        <Link
          href="/meetups/new"
          className="flex items-center gap-2 bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1b4332] transition-colors"
        >
          <Plus size={16} />
          Organise Meetup
        </Link>
      </div>

      {meetupsWithCounts.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No upcoming meetups"
          description="Be the first dad to organise a meetup in your area!"
          action={
            <Link
              href="/meetups/new"
              className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1b4332] transition-colors"
            >
              Organise a Meetup
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {meetupsWithCounts.map(meetup => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </div>
      )}
    </div>
  )
}
