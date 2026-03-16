'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PlaceGrid } from '@/components/places/PlaceGrid'
import { PlaceFilters } from '@/components/places/PlaceFilters'
import { PlaceSearch } from '@/components/places/PlaceSearch'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { PlaceWithScores, PlaceFilters as FilterState } from '@/types'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  area: 'All',
  categoryId: null,
  freeOnly: false,
  indoorOnly: false,
  sortBy: 'score',
}

export default function PlacesPage() {
  const [allPlaces, setAllPlaces] = useState<PlaceWithScores[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  useEffect(() => {
    // Read URL params on mount
    const params = new URLSearchParams(window.location.search)
    if (params.get('category')) {
      setFilters(f => ({ ...f, categoryId: Number(params.get('category')) }))
    }
    if (params.get('area')) {
      setFilters(f => ({ ...f, area: params.get('area') as string }))
    }

    const supabase = createClient()
    supabase
      .from('places_with_scores')
      .select('*, categories(*)')
      .eq('approved', true)
      .then(({ data }) => {
        setAllPlaces((data as PlaceWithScores[]) ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    let result = [...allPlaces]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.short_desc?.toLowerCase().includes(q) ||
          p.area?.toLowerCase().includes(q)
      )
    }

    if (filters.area !== 'All') {
      result = result.filter(p => p.area === filters.area)
    }

    if (filters.categoryId !== null) {
      result = result.filter(p => p.category_id === filters.categoryId)
    }

    if (filters.freeOnly) {
      result = result.filter(p => p.is_free)
    }

    if (filters.indoorOnly) {
      result = result.filter(p => p.is_indoor)
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'score') return (b.vote_score ?? 0) - (a.vote_score ?? 0)
      if (filters.sortBy === 'visits') return (b.visit_count ?? 0) - (a.visit_count ?? 0)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [allPlaces, filters])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Places to Go</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading…' : `${filtered.length} toddler-friendly spots in Hampshire`}
          </p>
        </div>
        <Link
          href="/places/add"
          className="flex items-center gap-2 bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1b4332] transition-colors"
        >
          <Plus size={16} />
          Add Place
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <PlaceSearch
          value={filters.search}
          onChange={search => setFilters(f => ({ ...f, search }))}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <PlaceFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" />
          <p className="text-center text-gray-400 mt-4 text-sm">Loading places…</p>
        </div>
      ) : (
        <PlaceGrid places={filtered} />
      )}
    </div>
  )
}
