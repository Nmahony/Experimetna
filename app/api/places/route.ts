import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    name, description, short_desc, category_id, area, address, postcode,
    lat, lng, website, admission, min_age_months, max_age_years,
    is_free, is_indoor, is_dog_friendly, facilities,
  } = body

  if (!name?.trim() || !description?.trim()) {
    return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
  }

  // Generate unique slug
  let slug = slugify(name)
  const { data: existing } = await supabase
    .from('places')
    .select('slug')
    .eq('slug', slug)
    .single()

  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const { data, error } = await supabase
    .from('places')
    .insert({
      slug,
      name: name.trim(),
      description: description.trim(),
      short_desc: short_desc?.trim() || null,
      category_id: category_id || null,
      area: area || 'Waterlooville',
      address: address?.trim() || null,
      postcode: postcode?.trim() || null,
      lat: lat || null,
      lng: lng || null,
      website: website?.trim() || null,
      admission: admission?.trim() || null,
      min_age_months: min_age_months ?? 0,
      max_age_years: max_age_years ?? 10,
      is_free: is_free ?? false,
      is_indoor: is_indoor ?? false,
      is_dog_friendly: is_dog_friendly ?? false,
      facilities: facilities ?? [],
      submitted_by: user.id,
      approved: false, // Requires admin approval
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
