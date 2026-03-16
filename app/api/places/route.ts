import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    name, description, category_id, area, address, postcode,
    lat, lng, website, admission, facilities, min_age_months,
    max_age_years, is_free, is_indoor, is_dog_friendly,
  } = body

  if (!name || !description || !lat || !lng || !area) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Generate unique slug
  let slug = slugify(name)
  const { data: existing } = await supabase.from('places').select('slug').eq('slug', slug).single()
  if (existing) slug = `${slug}-${Date.now()}`

  const { data, error } = await supabase
    .from('places')
    .insert({
      slug, name, description, category_id, area, address, postcode,
      lat, lng, website, admission, facilities, min_age_months,
      max_age_years, is_free, is_indoor, is_dog_friendly,
      submitted_by: user.id,
      approved: false, // pending moderation
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
