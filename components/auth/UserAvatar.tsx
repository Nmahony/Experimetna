'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function UserAvatar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setDisplayName(data.display_name)
              setAvatarUrl(data.avatar_url)
            }
          })
      }
    })
  }, [])

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="bg-white text-[#2d6a4f] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
      >
        Log in
      </Link>
    )
  }

  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? '?'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white/90 hover:text-white"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center text-sm font-bold text-white">
            {initials}
          </div>
        )}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User size={14} /> Profile
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
              router.refresh()
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  )
}
