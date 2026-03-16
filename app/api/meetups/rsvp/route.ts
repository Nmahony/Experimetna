import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { meetup_id } = await request.json()
  if (!meetup_id) return NextResponse.json({ error: 'meetup_id required' }, { status: 400 })

  // Check capacity
  const { data: meetup } = await supabase
    .from('meetups')
    .select('max_attendees')
    .eq('id', meetup_id)
    .single()

  if (meetup?.max_attendees) {
    const { count } = await supabase
      .from('meetup_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('meetup_id', meetup_id)

    if ((count || 0) >= meetup.max_attendees) {
      return NextResponse.json({ error: 'Meetup is full' }, { status: 409 })
    }
  }

  const { error } = await supabase
    .from('meetup_rsvps')
    .upsert({ meetup_id, user_id: user.id }, { onConflict: 'meetup_id,user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { meetup_id } = await request.json()
  const { error } = await supabase
    .from('meetup_rsvps')
    .delete()
    .eq('meetup_id', meetup_id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
