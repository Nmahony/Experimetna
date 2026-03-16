import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const placeId = formData.get('place_id') as string
  const caption = formData.get('caption') as string | null

  if (!file || !placeId) {
    return NextResponse.json({ error: 'file and place_id required' }, { status: 400 })
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const key = `${placeId}/${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('place-photos')
    .upload(key, file, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('place-photos')
    .getPublicUrl(key)

  const { data, error: dbError } = await supabase
    .from('photos')
    .insert({
      place_id: placeId,
      user_id: user.id,
      storage_key: key,
      caption: caption || null,
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ ...data, url: publicUrl })
}
