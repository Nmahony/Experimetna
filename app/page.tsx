import Link from 'next/link'
import { MapPin, Users, MessageSquare, ChevronRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PlaceCard } from '@/components/places/PlaceCard'
import { MeetupCard } from '@/components/meetups/MeetupCard'
import { ThreadCard } from '@/components/forum/ThreadCard'
import { WeatherWidget } from '@/components/shared/WeatherWidget'
import { SEASONAL_HIGHLIGHTS, CATEGORIES } from '@/lib/constants'
import type { PlaceWithScores, Meetup, ForumThread } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured places (top 3 by score)
  const { data: places } = await supabase
    .from('places_with_scores')
    .select('*, categories(*)')
    .eq('approved', true)
    .order('vote_score', { ascending: false })
    .limit(3)

  // Fetch upcoming meetups
  const today = new Date().toISOString().split('T')[0]
  const { data: meetups } = await supabase
    .from('meetups')
    .select('*, profiles(id, display_name, avatar_url), places(id, name, slug)')
    .gte('meetup_date', today)
    .order('meetup_date', { ascending: true })
    .limit(2)

  // Fetch meetup RSVP counts
  const meetupsWithCounts: Meetup[] = await Promise.all(
    (meetups ?? []).map(async (m) => {
      const { count } = await supabase
        .from('meetup_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('meetup_id', m.id)
      return { ...m, rsvp_count: count ?? 0 }
    })
  )

  // Fetch latest forum threads
  const { data: threads } = await supabase
    .from('forum_threads')
    .select('*, profiles(id, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(3)

  const currentMonth = new Date().getMonth()
  const seasonal = SEASONAL_HIGHLIGHTS[currentMonth]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#2d6a4f] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌿</div>
          <div className="absolute top-20 right-20 text-6xl">🌳</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🍃</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 text-white/90 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin size={12} /> Waterlooville · Havant · Fareham
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
              Your crew is<br />out there, Dad.
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
              Discover the best toddler-friendly places in Hampshire. Connect with other dads,
              arrange meetups, and get honest tips from dads who've been there.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/places"
                className="bg-[#f59e0b] text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-[#d97706] transition-colors flex items-center gap-2"
              >
                <MapPin size={18} /> Explore Places
              </Link>
              <Link
                href="/forum"
                className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white/30 transition-colors flex items-center gap-2 border border-white/20"
              >
                <MessageSquare size={18} /> Join the Chat
              </Link>
            </div>
            <WeatherWidget />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#1b4332] text-white/80 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm">
          <span className="flex items-center gap-2"><MapPin size={14} className="text-[#f59e0b]" /> 17+ family-friendly places</span>
          <span className="flex items-center gap-2"><Users size={14} className="text-[#f59e0b]" /> Growing dad community</span>
          <span className="flex items-center gap-2"><MessageSquare size={14} className="text-[#f59e0b]" /> Real reviews from real dads</span>
        </div>
      </section>

      {/* Seasonal Highlights */}
      {seasonal && (
        <section className="bg-amber-50 border-b border-amber-100 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">This Month</p>
                <h2 className="text-xl font-bold text-gray-900">{seasonal.label}</h2>
                <p className="text-gray-600 text-sm">{seasonal.description}</p>
              </div>
              <div className="hidden md:flex gap-2">
                {seasonal.categorySlugs.map(slug => {
                  const cat = CATEGORIES.find(c => c.slug === slug)
                  return cat ? (
                    <Link
                      key={slug}
                      href={`/places?category=${cat.id}`}
                      className="flex items-center gap-1.5 bg-white border border-amber-200 text-gray-700 text-sm px-3 py-1.5 rounded-full hover:border-[#2d6a4f] transition-colors"
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ) : null
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Places */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Top Picks</h2>
            <p className="text-gray-500 text-sm">Highest rated by Hampshire dads</p>
          </div>
          <Link href="/places" className="flex items-center gap-1 text-[#2d6a4f] text-sm font-semibold hover:underline">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(places as PlaceWithScores[] ?? []).map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
        {(!places || places.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🌿</p>
            <p>Places coming soon!</p>
          </div>
        )}
      </section>

      {/* Meetups + Forum two-column */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Meetups */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Upcoming Meetups</h2>
                  <p className="text-gray-500 text-sm">Get out, meet other dads</p>
                </div>
                <Link href="/meetups" className="flex items-center gap-1 text-[#2d6a4f] text-sm font-semibold hover:underline">
                  All meetups <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {meetupsWithCounts.length > 0 ? (
                  meetupsWithCounts.map(meetup => (
                    <MeetupCard key={meetup.id} meetup={meetup} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <p className="text-3xl mb-2">📅</p>
                    <p className="text-gray-500 text-sm mb-3">No meetups yet — why not organise one?</p>
                    <Link
                      href="/meetups/new"
                      className="bg-[#2d6a4f] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1b4332] transition-colors"
                    >
                      Organise a Meetup
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Forum */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Dad Chat</h2>
                  <p className="text-gray-500 text-sm">What the lads are talking about</p>
                </div>
                <Link href="/forum" className="flex items-center gap-1 text-[#2d6a4f] text-sm font-semibold hover:underline">
                  All threads <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-2">
                {(threads as ForumThread[] ?? []).length > 0 ? (
                  (threads as ForumThread[]).map(thread => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-gray-500 text-sm mb-3">No threads yet. Start the conversation!</p>
                    <Link
                      href="/forum/new"
                      className="bg-[#2d6a4f] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1b4332] transition-colors"
                    >
                      Start a Thread
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2d6a4f] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-3">Know a great place?</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">
            Help other dads discover toddler-friendly spots. Add a place and share your experience.
          </p>
          <Link
            href="/places/add"
            className="inline-flex items-center gap-2 bg-[#f59e0b] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d97706] transition-colors"
          >
            <Star size={18} />
            Add a Place
          </Link>
        </div>
      </section>
    </div>
  )
}
