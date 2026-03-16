import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { threadId, body } = await req.json()
  if (!threadId || !body?.trim()) {
    return NextResponse.json({ error: 'Thread ID and body are required' }, { status: 400 })
  }

  // Check thread exists and is not locked
  const { data: thread } = await supabase
    .from('forum_threads')
    .select('locked')
    .eq('id', threadId)
    .single()

  if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  if (thread.locked) return NextResponse.json({ error: 'Thread is locked' }, { status: 403 })

  const { data, error } = await supabase
    .from('forum_replies')
    .insert({ thread_id: threadId, author_id: user.id, body: body.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
