'use client'
import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Props {
  placeId: string
  initialScore: number
  userVote?: number | null
}

export function VoteButtons({ placeId, initialScore, userVote: initialVote }: Props) {
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState<number | null | undefined>(initialVote)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const vote = async (value: 1 | -1) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setLoading(true)
    const isToggle = userVote === value

    // Optimistic update
    if (isToggle) {
      setScore(score - value)
      setUserVote(null)
    } else {
      const diff = value - (userVote ?? 0)
      setScore(score + diff)
      setUserVote(value)
    }

    try {
      const res = await fetch('/api/votes', {
        method: isToggle ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, value }),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      // Revert
      setScore(initialScore)
      setUserVote(initialVote)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote(1)}
        disabled={loading}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all border',
          userVote === 1
            ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
            : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
        )}
      >
        <ThumbsUp size={15} />
        {score > 0 ? `+${score}` : score}
      </button>
      <button
        onClick={() => vote(-1)}
        disabled={loading}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all border',
          userVote === -1
            ? 'bg-red-500 text-white border-red-500'
            : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-500'
        )}
      >
        <ThumbsDown size={15} />
      </button>
    </div>
  )
}
