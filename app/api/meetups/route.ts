import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, place_id, meetup_date, meetup_time, max_attendees } = await request.json()
  if (!title?.trim() || !meetup_date) {
    return NextResponse.json({ error: 'title and meetup_date required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('meetups')
    .insert({
      title: title.trim(),
      description: description?.trim(),
      place_id: place_id || null,
      meetup_date,
      meetup_time: meetup_time || null,
      max_attendees: max_attendees || null,
      organiser_id: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
