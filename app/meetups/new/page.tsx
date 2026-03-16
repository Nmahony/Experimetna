import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewMeetupForm } from '@/components/meetups/NewMeetupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Organise a Meetup | PO Dads' }

export default async function NewMeetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/meetups/new')

  const { data: places } = await supabase
    .from('places')
    .select('id, name, area')
    .eq('approved', true)
    .order('name')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Organise a Meetup</h1>
      <p className="text-[var(--muted)] mb-8">
        Set a date, pick a place, and invite other dads. Great meetups start with one person stepping up.
      </p>
      <NewMeetupForm places={places || []} />
    </div>
  )
}
