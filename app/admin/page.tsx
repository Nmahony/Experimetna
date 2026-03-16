import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-3">Access Denied</h1>
        <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
        <Link href="/" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold">
          Go Home
        </Link>
      </div>
    )
  }

  const [{ data: pendingPlaces }, { data: flaggedComments }] = await Promise.all([
    supabase
      .from('places')
      .select('*, profiles(display_name)')
      .eq('approved', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('comments')
      .select('*, profiles(display_name), places(name, slug)')
      .eq('approved', false)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage pending content and moderation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-700 font-semibold text-2xl">{pendingPlaces?.length ?? 0}</p>
          <p className="text-amber-600 text-sm">Places pending approval</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold text-2xl">{flaggedComments?.length ?? 0}</p>
          <p className="text-red-600 text-sm">Comments flagged</p>
        </div>
      </div>

      {/* Pending Places */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Place Approvals ({pendingPlaces?.length ?? 0})
        </h2>
        {!pendingPlaces?.length ? (
          <div className="bg-green-50 rounded-xl p-6 text-center text-green-700">
            <CheckCircle className="mx-auto mb-2" size={24} />
            <p className="text-sm">All caught up! No pending places.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPlaces.map(place => (
              <div key={place.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{place.name}</h3>
                    <p className="text-sm text-gray-500">{place.area} · Submitted by {(place as any).profiles?.display_name ?? 'unknown'}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.short_desc}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <ApproveButton placeId={place.id} action="approve" />
                    <ApproveButton placeId={place.id} action="reject" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Flagged Comments */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Flagged Comments ({flaggedComments?.length ?? 0})
        </h2>
        {!flaggedComments?.length ? (
          <div className="bg-green-50 rounded-xl p-6 text-center text-green-700">
            <CheckCircle className="mx-auto mb-2" size={24} />
            <p className="text-sm">No flagged comments. Community is behaving!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedComments.map(comment => (
              <div key={comment.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      On <Link href={`/places/${(comment as any).places?.slug}`} className="text-[#2d6a4f] hover:underline">
                        {(comment as any).places?.name}
                      </Link> · by {(comment as any).profiles?.display_name ?? 'unknown'}
                    </p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ApproveButton({ placeId, action }: { placeId: string; action: 'approve' | 'reject' }) {
  return (
    <form action={async () => {
      'use server'
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await supabase
        .from('places')
        .update({ approved: action === 'approve' })
        .eq('id', placeId)
    }}>
      <button
        type="submit"
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          action === 'approve'
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {action === 'approve' ? <CheckCircle size={12} /> : <XCircle size={12} />}
        {action === 'approve' ? 'Approve' : 'Reject'}
      </button>
    </form>
  )
}
