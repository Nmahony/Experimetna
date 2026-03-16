import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { thread_id, body } = await request.json()
  if (!thread_id || !body?.trim()) {
    return NextResponse.json({ error: 'thread_id and body required' }, { status: 400 })
  }

  // Check thread exists and is not locked
  const { data: thread } = await supabase
    .from('forum_threads')
    .select('id, locked')
    .eq('id', thread_id)
    .single()

  if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  if (thread.locked) return NextResponse.json({ error: 'Thread is locked' }, { status: 403 })

  const { data, error } = await supabase
    .from('forum_replies')
    .insert({ thread_id, author_id: user.id, body: body.trim() })
    .select('*, profiles(username, display_name, avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
