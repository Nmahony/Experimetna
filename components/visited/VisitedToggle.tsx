'use client'
import { useState } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  placeId: string
  initialVisited: boolean
  initialCount: number
}

export function VisitedToggle({ placeId, initialVisited, initialCount }: Props) {
  const [visited, setVisited] = useState(initialVisited)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const wasVisited = visited
    setVisited(!visited)
    setCount(wasVisited ? count - 1 : count + 1)

    try {
      const res = await fetch('/api/visited', {
        method: wasVisited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      })
      if (res.status === 401) {
        setVisited(wasVisited)
        setCount(wasVisited ? count : count - 1)
        window.location.href = '/auth/login'
      } else if (!res.ok) throw new Error()
    } catch {
      setVisited(wasVisited)
      setCount(initialCount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all border',
        visited
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
      )}
    >
      {visited ? <CheckCircle size={15} className="fill-green-500 text-green-500" /> : <Circle size={15} />}
      {visited ? 'Visited!' : 'Mark visited'}
      <span className="text-xs opacity-70">({count})</span>
    </button>
  )
}
