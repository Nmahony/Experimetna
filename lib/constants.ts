export const SITE_NAME = 'PO Dads'
export const SITE_DESCRIPTION = "Hampshire's community for dads & toddlers in the Waterlooville, Havant and Fareham area."
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const MAP_CENTER = { lat: 50.865, lng: -1.065 }
export const MAP_DEFAULT_ZOOM = 12

export const AREAS = ['All', 'Waterlooville', 'Havant', 'Fareham'] as const
export type Area = typeof AREAS[number]

export const CATEGORIES = [
  { id: 1, slug: 'playground', name: 'Playground', icon: '🛝', color: 'blue' },
  { id: 2, slug: 'park', name: 'Park & Nature', icon: '🌳', color: 'green' },
  { id: 3, slug: 'cafe', name: 'Toddler Café', icon: '☕', color: 'amber' },
  { id: 4, slug: 'soft-play', name: 'Soft Play', icon: '🏠', color: 'pink' },
  { id: 5, slug: 'farm', name: 'Farm & Animals', icon: '🐄', color: 'orange' },
  { id: 6, slug: 'beach', name: 'Beach & Water', icon: '🏖️', color: 'cyan' },
  { id: 7, slug: 'museum', name: 'Museum & Learn', icon: '🏛️', color: 'purple' },
  { id: 8, slug: 'sports', name: 'Sports & Active', icon: '⚽', color: 'red' },
  { id: 9, slug: 'library', name: 'Library & Classes', icon: '📚', color: 'yellow' },
  { id: 10, slug: 'garden', name: 'Garden & NT', icon: '🌸', color: 'lime' },
] as const

export const FORUM_CATEGORIES = [
  { slug: 'general', name: 'General', icon: '💬' },
  { slug: 'meetups', name: 'Meetups', icon: '🤝' },
  { slug: 'advice', name: 'Advice', icon: '💡' },
  { slug: 'gear', name: 'Gear & Kit', icon: '🎒' },
  { slug: 'introductions', name: 'Introductions', icon: '👋' },
  { slug: 'local-news', name: 'Local News', icon: '📰' },
] as const

export const FACILITIES = [
  { key: 'toilets', label: 'Toilets', icon: '🚻' },
  { key: 'parking', label: 'Parking', icon: '🅿️' },
  { key: 'baby_change', label: 'Baby Change', icon: '👶' },
  { key: 'cafe', label: 'Café', icon: '☕' },
  { key: 'cafe_nearby', label: 'Café Nearby', icon: '☕' },
  { key: 'accessible', label: 'Accessible', icon: '♿' },
  { key: 'picnic_area', label: 'Picnic Area', icon: '🧺' },
  { key: 'open_space', label: 'Open Space', icon: '🌿' },
  { key: 'sand_play', label: 'Sand Play', icon: '🏖️' },
  { key: 'water_play', label: 'Water Play', icon: '💧' },
  { key: 'splash_pad', label: 'Splash Pad', icon: '💦' },
  { key: 'cycling', label: 'Cycling', icon: '🚲' },
  { key: 'beach', label: 'Beach', icon: '🏖️' },
  { key: 'farm_animals', label: 'Farm Animals', icon: '🐄' },
  { key: 'animal_encounters', label: 'Animal Encounters', icon: '🦜' },
  { key: 'duck_feeding', label: 'Duck Feeding', icon: '🦆' },
  { key: 'visitor_centre', label: 'Visitor Centre', icon: '🏠' },
  { key: 'waterfront', label: 'Waterfront', icon: '⛵' },
  { key: 'ice_cream', label: 'Ice Cream', icon: '🍦' },
  { key: 'baby_area', label: 'Baby Zone', icon: '🍼' },
  { key: 'enclosed_toddler_area', label: 'Enclosed Play', icon: '🔒' },
] as const

export const SEASONAL_HIGHLIGHTS: Record<number, { label: string; description: string; categorySlugs: string[] }> = {
  0: { label: 'Indoor Winter Fun', description: 'Stay warm and dry this January', categorySlugs: ['soft-play', 'library', 'museum'] },
  1: { label: 'Half-Term Picks', description: 'February half-term sorted', categorySlugs: ['museum', 'soft-play', 'farm'] },
  2: { label: 'First Signs of Spring', description: 'Get outside in March', categorySlugs: ['park', 'garden', 'playground'] },
  3: { label: 'Bluebell Season 🌸', description: 'Gorgeous woodland walks in April', categorySlugs: ['park', 'garden'] },
  4: { label: 'Bank Holiday Weekends', description: 'Make the most of May sunshine', categorySlugs: ['beach', 'park', 'farm'] },
  5: { label: 'Beach Season Begins 🏖️', description: 'Head to the coast in June', categorySlugs: ['beach', 'park'] },
  6: { label: 'Summer Adventures ☀️', description: 'Sun is out – make the most of it!', categorySlugs: ['beach', 'park', 'sports'] },
  7: { label: 'Late Summer Splash', description: 'Hot August days sorted', categorySlugs: ['beach', 'sports', 'playground'] },
  8: { label: 'Autumn Explorers 🍂', description: 'Crisp September walks', categorySlugs: ['park', 'garden', 'farm'] },
  9: { label: 'Harvest & Halloween 🎃', description: 'Autumnal October activities', categorySlugs: ['farm', 'park', 'museum'] },
  10: { label: 'Cosy Indoor Days', description: 'November warmth indoors', categorySlugs: ['soft-play', 'library', 'cafe'] },
  11: { label: 'Festive Fun 🎄', description: 'December magic for little ones', categorySlugs: ['museum', 'garden', 'library'] },
}
