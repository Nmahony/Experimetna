import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { MapPin, Clock, Users, ArrowLeft, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { RSVPButton } from '@/components/meetups/RSVPButton'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('meetups').select('title').eq('id', id).single()
  return { title: data ? `${data.title} | PO Dads Meetups` : 'Meetup | PO Dads' }
}

export default async function MeetupDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: meetup } = await supabase
    .from('meetups')
    .select('*, profiles(id, display_name, avatar_url), places(id, name, slug, area)')
    .eq('id', id)
    .single()

  if (!meetup) notFound()

  const { count: rsvpCount } = await supabase
    .from('meetup_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('meetup_id', id)

  const { data: { user } } = await supabase.auth.getUser()

  let userRsvpd = false
  if (user) {
    const { data: rsvp } = await supabase
      .from('meetup_rsvps')
      .select('id')
      .eq('meetup_id', id)
      .eq('user_id', user.id)
      .single()
    userRsvpd = !!rsvp
  }

  const date = new Date(meetup.meetup_date)
  const profile = meetup.profiles

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/meetups" className="flex items-center gap-1 text-gray-400 hover:text-[#2d6a4f] text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> All Meetups
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Date header */}
        <div className="bg-[#2d6a4f] text-white p-6">
          <p className="text-white/70 text-sm font-medium mb-1">{format(date, 'EEEE')}</p>
          <h1 className="text-3xl font-black mb-1">{format(date, 'd MMMM yyyy')}</h1>
          {meetup.meetup_time && (
            <p className="text-white/80 flex items-center gap-1">
              <Clock size={14} /> {meetup.meetup_time.slice(0, 5)}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <h2 className="text-2xl font-black text-gray-900">{meetup.title}</h2>

          {meetup.description && (
            <p className="text-gray-700 leading-relaxed">{meetup.description}</p>
          )}

          {/* Details */}
          <div className="space-y-3">
            {meetup.places && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-[#2d6a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Location</p>
                  <Link
                    href={`/places/${meetup.places.slug}`}
                    className="text-[#2d6a4f] hover:underline"
                  >
                    {meetup.places.name}
                  </Link>
                  {meetup.places.area && (
                    <span className="text-gray-400 ml-1">· {meetup.places.area}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm">
              <Users size={16} className="text-[#2d6a4f] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Attendees</p>
                <p className="text-gray-600">
                  {rsvpCount ?? 0} going
                  {meetup.max_attendees && ` · max ${meetup.max_attendees}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <User size={16} className="text-[#2d6a4f] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Organiser</p>
                <p className="text-gray-600">{profile?.display_name ?? 'A dad'}</p>
              </div>
            </div>
          </div>

          {/* RSVP */}
          <div className="pt-4 border-t border-gray-100">
            <RSVPButton
              meetupId={id}
              initialRsvpd={userRsvpd}
              initialCount={rsvpCount ?? 0}
              maxAttendees={meetup.max_attendees}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
