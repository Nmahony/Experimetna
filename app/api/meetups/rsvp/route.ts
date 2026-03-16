import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { meetupId } = await req.json()
  if (!meetupId) return NextResponse.json({ error: 'Meetup ID required' }, { status: 400 })

  // Check capacity
  const { data: meetup } = await supabase
    .from('meetups')
    .select('max_attendees')
    .eq('id', meetupId)
    .single()

  if (meetup?.max_attendees) {
    const { count } = await supabase
      .from('meetup_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('meetup_id', meetupId)

    if ((count ?? 0) >= meetup.max_attendees) {
      return NextResponse.json({ error: 'Meetup is full' }, { status: 409 })
    }
  }

  const { error } = await supabase
    .from('meetup_rsvps')
    .upsert({ meetup_id: meetupId, user_id: user.id }, { onConflict: 'meetup_id,user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { meetupId } = await req.json()

  const { error } = await supabase
    .from('meetup_rsvps')
    .delete()
    .eq('meetup_id', meetupId)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
