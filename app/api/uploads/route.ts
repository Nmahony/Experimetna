import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { placeId, storageKey, caption } = await req.json()
  if (!placeId || !storageKey) {
    return NextResponse.json({ error: 'Place ID and storage key required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('photos')
    .insert({
      place_id: placeId,
      user_id: user.id,
      storage_key: storageKey,
      caption: caption || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
