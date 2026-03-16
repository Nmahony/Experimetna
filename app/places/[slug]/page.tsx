import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Globe, Phone, Clock, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { AgeRangeBadge } from '@/components/shared/AgeRangeBadge'
import { FacilityBadge } from '@/components/shared/FacilityBadge'
import { VoteButtons } from '@/components/voting/VoteButtons'
import { VisitedToggle } from '@/components/visited/VisitedToggle'
import { SaveButton } from '@/components/visited/SaveButton'
import { CommentList } from '@/components/comments/CommentList'
import { CommentForm } from '@/components/comments/CommentForm'
import { PhotoGallery } from '@/components/photos/PhotoGallery'
import { PhotoUpload } from '@/components/photos/PhotoUpload'
import { TipsList } from '@/components/tips/TipsList'
import { TipForm } from '@/components/tips/TipForm'
import { PlaceDetailMap } from '@/components/map/PlaceDetailMap'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: place } = await supabase
    .from('places')
    .select('name, short_desc, area')
    .eq('slug', slug)
    .single()

  if (!place) return { title: 'Place Not Found | PO Dads' }

  return {
    title: `${place.name} | PO Dads`,
    description: place.short_desc ?? `${place.name} in ${place.area} - family-friendly place for toddlers in Hampshire`,
  }
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: place } = await supabase
    .from('places_with_scores')
    .select('*, categories(*)')
    .eq('slug', slug)
    .single()

  if (!place) notFound()

  const [{ data: comments }, { data: photos }, { data: tips }, { data: { user } }] = await Promise.all([
    supabase
      .from('comments')
      .select('*, profiles(id, display_name, avatar_url)')
      .eq('place_id', place.id)
      .eq('approved', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('photos')
      .select('*, profiles(id, display_name, avatar_url)')
      .eq('place_id', place.id)
      .eq('approved', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('toddler_tips')
      .select('*, profiles(id, display_name, avatar_url)')
      .eq('place_id', place.id)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  let userVote = null
  let userVisited = false
  let userSaved = false

  if (user) {
    const [voteResult, visitedResult, savedResult] = await Promise.all([
      supabase.from('votes').select('value').eq('place_id', place.id).eq('user_id', user.id).single(),
      supabase.from('visited').select('id').eq('place_id', place.id).eq('user_id', user.id).single(),
      supabase.from('saved_places').select('id').eq('place_id', place.id).eq('user_id', user.id).single(),
    ])
    userVote = voteResult.data?.value ?? null
    userVisited = !!visitedResult.data
    userSaved = !!savedResult.data
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  const placeAsWithScores = {
    ...place,
    vote_score: place.vote_score ?? 0,
    visit_count: place.visit_count ?? 0,
    comment_count: place.comment_count ?? 0,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/places" className="hover:text-[#2d6a4f]">Places</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{place.name}</span>
      </nav>

      {/* Cover image */}
      <div className="relative h-56 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-green-400 to-emerald-600">
        {place.cover_image_url ? (
          <img src={place.cover_image_url} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
            {place.is_indoor ? '🏠' : '🌿'}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
          <div className="flex gap-2 mb-2">
            {place.is_free && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>
            )}
            {place.is_indoor && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Indoor</span>
            )}
            {place.is_dog_friendly && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Dog friendly 🐕</span>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <CategoryBadge categoryId={place.category_id} />
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                <MapPin size={11} /> {place.area}
              </span>
              <AgeRangeBadge minMonths={place.min_age_months} maxYears={place.max_age_years} />
            </div>
            <h1 className="text-3xl font-black text-gray-900">{place.name}</h1>
            {place.address && (
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <MapPin size={13} /> {place.address}{place.postcode ? `, ${place.postcode}` : ''}
              </p>
            )}
          </div>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-colors flex-shrink-0"
            >
              <ExternalLink size={13} /> Website
            </a>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
        <VoteButtons placeId={place.id} initialScore={place.vote_score ?? 0} userVote={userVote} />
        <VisitedToggle
          placeId={place.id}
          initialVisited={userVisited}
          initialCount={place.visit_count ?? 0}
        />
        <SaveButton placeId={place.id} initialSaved={userSaved} />
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-3">About this place</h2>
        <p className="text-gray-700 leading-relaxed">{place.description}</p>

        {place.admission && (
          <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
            💷 <strong>Admission:</strong> {place.admission}
          </div>
        )}
      </div>

      {/* Facilities */}
      {place.facilities && place.facilities.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 mb-3">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {place.facilities.map((f: string) => (
              <FacilityBadge key={f} facilityKey={f} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="space-y-8">
        {/* Comments */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Comments ({(comments ?? []).length})
          </h2>
          <CommentList comments={comments ?? []} />
          <CommentForm placeId={place.id} />
        </section>

        {/* Photos */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Photos ({(photos ?? []).length})
          </h2>
          <PhotoGallery photos={photos ?? []} supabaseUrl={supabaseUrl} />
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Add a photo</h3>
            <PhotoUpload placeId={place.id} />
          </div>
        </section>

        {/* Toddler Tips */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Toddler Tips ({(tips ?? []).length})
          </h2>
          <TipsList tips={tips ?? []} />
          <TipForm placeId={place.id} />
        </section>

        {/* Map */}
        {place.lat && place.lng && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
              <PlaceDetailMap place={placeAsWithScores} />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-[#2d6a4f] hover:underline"
            >
              <MapPin size={13} /> Open in Google Maps
            </a>
          </section>
        )}
      </div>
    </div>
  )
}
