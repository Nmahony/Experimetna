import Link from 'next/link'
import { format } from 'date-fns'
import { Clock, MapPin, Users } from 'lucide-react'
import type { Meetup } from '@/types'

interface Props {
  meetup: Meetup
}

export function MeetupCard({ meetup }: Props) {
  const date = new Date(meetup.meetup_date)
  const day = format(date, 'd')
  const month = format(date, 'MMM').toUpperCase()
  const weekday = format(date, 'EEEE')

  return (
    <Link href={`/meetups/${meetup.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 hover:border-[#2d6a4f]/30 hover:shadow-sm transition-all flex overflow-hidden">
        {/* Date block */}
        <div className="bg-[#2d6a4f] text-white flex flex-col items-center justify-center px-5 py-4 min-w-[80px]">
          <span className="text-2xl font-black leading-none">{day}</span>
          <span className="text-xs font-semibold tracking-widest mt-0.5">{month}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="font-bold text-gray-900 group-hover:text-[#2d6a4f] transition-colors mb-1 line-clamp-1">
            {meetup.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {weekday}
              {meetup.meetup_time && ` at ${meetup.meetup_time.slice(0, 5)}`}
            </span>
            {meetup.places && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {meetup.places.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users size={11} /> {meetup.rsvp_count ?? 0} going
              {meetup.max_attendees && ` / ${meetup.max_attendees} max`}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            By {meetup.profiles?.display_name ?? 'A dad'}
          </p>
        </div>
      </div>
    </Link>
  )
}
