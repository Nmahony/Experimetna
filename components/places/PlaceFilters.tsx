'use client'
import { useState } from 'react'
import { SlidersHorizontal, ToggleLeft, ToggleRight } from 'lucide-react'
import { AREAS, CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PlaceFilters as FilterState } from '@/types'

interface Props {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function PlaceFilters({ filters, onChange }: Props) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  return (
    <div className="space-y-4">
      {/* Area filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Area</p>
        <div className="flex flex-wrap gap-2">
          {AREAS.map(area => (
            <button
              key={area}
              onClick={() => update({ area })}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                filters.area === area
                  ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
              )}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ categoryId: null })}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
              filters.categoryId === null
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
            )}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => update({ categoryId: cat.id })}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1',
                filters.categoryId === cat.id
                  ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles + Sort */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => update({ freeOnly: !filters.freeOnly })}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          {filters.freeOnly
            ? <ToggleRight size={20} className="text-[#2d6a4f]" />
            : <ToggleLeft size={20} className="text-gray-400" />}
          Free only
        </button>
        <button
          onClick={() => update({ indoorOnly: !filters.indoorOnly })}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          {filters.indoorOnly
            ? <ToggleRight size={20} className="text-[#2d6a4f]" />
            : <ToggleLeft size={20} className="text-gray-400" />}
          Indoor only
        </button>

        <div className="ml-auto flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <select
            value={filters.sortBy}
            onChange={e => update({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:border-[#2d6a4f]"
          >
            <option value="score">Top rated</option>
            <option value="recent">Most recent</option>
            <option value="visits">Most visited</option>
          </select>
        </div>
      </div>
    </div>
  )
}
