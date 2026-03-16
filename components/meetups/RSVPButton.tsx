'use client'
import { useState } from 'react'
import { CalendarCheck, CalendarX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  meetupId: string
  initialRsvpd: boolean
  initialCount: number
  maxAttendees?: number | null
}

export function RSVPButton({ meetupId, initialRsvpd, initialCount, maxAttendees }: Props) {
  const [rsvpd, setRsvpd] = useState(initialRsvpd)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const isFull = !rsvpd && maxAttendees !== null && maxAttendees !== undefined && count >= maxAttendees

  const toggle = async () => {
    setLoading(true)
    const was = rsvpd
    setRsvpd(!was)
    setCount(was ? count - 1 : count + 1)

    try {
      const res = await fetch('/api/meetups/rsvp', {
        method: was ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetupId }),
      })
      if (res.status === 401) {
        setRsvpd(was)
        setCount(initialCount)
        window.location.href = '/auth/login'
      } else if (!res.ok) throw new Error()
    } catch {
      setRsvpd(was)
      setCount(initialCount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={loading || isFull}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
          rsvpd
            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            : isFull
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-[#2d6a4f] text-white hover:bg-[#1b4332]'
        )}
      >
        {rsvpd ? <CalendarX size={16} /> : <CalendarCheck size={16} />}
        {rsvpd ? "Cancel RSVP" : isFull ? "Full" : "RSVP"}
      </button>
      <span className="text-sm text-gray-500">
        {count} {count === 1 ? 'person' : 'people'} going
        {maxAttendees && ` (max ${maxAttendees})`}
      </span>
    </div>
  )
}
