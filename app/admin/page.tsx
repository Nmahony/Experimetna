import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminPanel } from '@/components/admin/AdminPanel'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin | PO Dads' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/')

  const [pendingPlaces, recentComments] = await Promise.all([
    supabase.from('places').select('*, profiles(username, display_name)').eq('approved', false).order('created_at', { ascending: false }),
    supabase.from('comments').select('*, profiles(username, display_name), places(name, slug)').eq('approved', false).order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
      <p className="text-[var(--muted)] mb-8">Review submissions and moderate content.</p>
      <AdminPanel
        pendingPlaces={pendingPlaces.data || []}
        pendingComments={recentComments.data || []}
      />
    </div>
  )
}
