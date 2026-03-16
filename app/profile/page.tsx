import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlaceGrid } from '@/components/places/PlaceGrid'
import { ForumThreadList } from '@/components/forum/ForumThreadList'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Profile | PO Dads' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/profile')

  const [profileRes, visitedRes, savedRes, threadsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('visited').select('places_with_scores(*, categories(*))').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('saved_places').select('places_with_scores(*, categories(*))').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('forum_threads').select('*, profiles(username, display_name, avatar_url)').eq('author_id', user.id).order('created_at', { ascending: false }),
  ])

  const profile = profileRes.data
  const visitedPlaces = (visitedRes.data || []).map((r: any) => r.places_with_scores).filter(Boolean)
  const savedPlaces = (savedRes.data || []).map((r: any) => r.places_with_scores).filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
            {(profile?.display_name || profile?.username || 'D')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.display_name || profile?.username || 'Dad'}</h1>
            {profile?.area && <p className="text-[var(--muted)] text-sm">📍 {profile.area}</p>}
            {profile?.kids_ages && profile.kids_ages.length > 0 && (
              <p className="text-sm mt-1">
                👶 Kids: {profile.kids_ages.join(', ')}
              </p>
            )}
          </div>
        </div>
        {profile?.bio && <p className="text-sm mt-4 text-[var(--muted)]">{profile.bio}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Visited', value: visitedPlaces.length, icon: '✅' },
          { label: 'Saved', value: savedPlaces.length, icon: '🔖' },
          { label: 'Threads', value: threadsRes.data?.length || 0, icon: '💬' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-[var(--muted)]">{label}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="visited">
        <TabsList>
          <TabsTrigger value="visited">Visited ({visitedPlaces.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedPlaces.length})</TabsTrigger>
          <TabsTrigger value="threads">My Threads ({threadsRes.data?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="visited">
          {visitedPlaces.length > 0 ? (
            <PlaceGrid places={visitedPlaces} />
          ) : (
            <div className="text-center py-12 text-[var(--muted)]">
              <p className="text-4xl mb-3">🗺️</p>
              <p>No places visited yet — get out there!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {savedPlaces.length > 0 ? (
            <PlaceGrid places={savedPlaces} />
          ) : (
            <div className="text-center py-12 text-[var(--muted)]">
              <p className="text-4xl mb-3">🔖</p>
              <p>No saved places yet. Bookmark the ones you want to visit.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="threads">
          <ForumThreadList threads={threadsRes.data || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
