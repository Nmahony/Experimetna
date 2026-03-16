'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit2, MapPin, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PlaceCard } from '@/components/places/PlaceCard'
import { ThreadCard } from '@/components/forum/ThreadCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Tab = 'visited' | 'saved' | 'places' | 'forum'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('visited')
  const [visitedPlaces, setVisitedPlaces] = useState<any[]>([])
  const [savedPlaces, setSavedPlaces] = useState<any[]>([])
  const [myPlaces, setMyPlaces] = useState<any[]>([])
  const [myThreads, setMyThreads] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)

      const [
        { data: visited },
        { data: saved },
        { data: places },
        { data: threads },
      ] = await Promise.all([
        supabase
          .from('visited')
          .select('place_id, places_with_scores(*, categories(*))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('saved_places')
          .select('place_id, places_with_scores(*, categories(*))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('places_with_scores')
          .select('*, categories(*)')
          .eq('submitted_by', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('forum_threads')
          .select('*, profiles(id, display_name, avatar_url)')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      setVisitedPlaces(visited?.map((v: any) => v.places_with_scores).filter(Boolean) ?? [])
      setSavedPlaces(saved?.map((s: any) => s.places_with_scores).filter(Boolean) ?? [])
      setMyPlaces(places ?? [])
      setMyThreads(threads ?? [])
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'visited', label: 'Visited', count: visitedPlaces.length },
    { id: 'saved', label: 'Saved', count: savedPlaces.length },
    { id: 'places', label: 'My Places', count: myPlaces.length },
    { id: 'forum', label: 'Forum', count: myThreads.length },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-2xl font-black">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">{profile?.display_name ?? 'Dad'}</h1>
              {profile?.area && (
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin size={13} /> {profile.area}
                </p>
              )}
              {profile?.bio && (
                <p className="text-gray-600 text-sm mt-2 max-w-md">{profile.bio}</p>
              )}
              {profile?.kids_ages && profile.kids_ages.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Kids: {profile.kids_ages.join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <LogOut size={13} /> Log out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-1.5 text-xs bg-[#2d6a4f] text-white rounded-full px-1.5 py-0.5">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'visited' && (
        <div>
          {visitedPlaces.length === 0 ? (
            <EmptyState icon="🗺️" title="No visited places yet" description="Mark places as visited when you go!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visitedPlaces.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div>
          {savedPlaces.length === 0 ? (
            <EmptyState icon="🔖" title="No saved places" description="Save places to visit later!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPlaces.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'places' && (
        <div>
          {myPlaces.length === 0 ? (
            <EmptyState
              icon="📍"
              title="You haven't added any places"
              action={<Link href="/places/add" className="bg-[#2d6a4f] text-white px-5 py-2.5 rounded-xl font-semibold text-sm">Add a Place</Link>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPlaces.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'forum' && (
        <div>
          {myThreads.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No forum posts yet"
              action={<Link href="/forum/new" className="bg-[#2d6a4f] text-white px-5 py-2.5 rounded-xl font-semibold text-sm">Start a Thread</Link>}
            />
          ) : (
            <div className="space-y-2">
              {myThreads.map(t => <ThreadCard key={t.id} thread={t} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
