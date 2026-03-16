import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { place_id, tip } = await request.json()
  if (!place_id || !tip?.trim()) {
    return NextResponse.json({ error: 'place_id and tip required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('toddler_tips')
    .insert({ place_id, user_id: user.id, tip: tip.trim() })
    .select('*, profiles(username, display_name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tip_id } = await request.json()
  const { error } = await supabase
    .from('toddler_tips')
    .delete()
    .eq('id', tip_id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
