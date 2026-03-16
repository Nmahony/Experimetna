import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, body, category } = await request.json()
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'title and body required' }, { status: 400 })
  }

  let slug = slugify(title)
  const { data: existing } = await supabase.from('forum_threads').select('id').eq('slug', slug).single()
  if (existing) slug = `${slug}-${Date.now()}`

  const { data, error } = await supabase
    .from('forum_threads')
    .insert({
      title: title.trim(),
      body: body.trim(),
      slug,
      author_id: user.id,
      category: category || 'general',
    })
    .select('*, profiles(username, display_name, avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
