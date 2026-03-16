export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  kids_ages: string[] | null
  area: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  slug: string
  name: string
  icon: string
  color: string
}

export interface Place {
  id: string
  slug: string
  name: string
  description: string
  short_desc: string | null
  category_id: number | null
  address: string | null
  postcode: string | null
  lat: number
  lng: number
  website: string | null
  phone: string | null
  opening_hours: Record<string, string> | null
  admission: string | null
  min_age_months: number
  max_age_years: number
  facilities: string[] | null
  is_free: boolean
  is_indoor: boolean
  is_dog_friendly: boolean
  area: string
  cover_image_url: string | null
  approved: boolean
  submitted_by: string | null
  created_at: string
  updated_at: string
  categories?: Category
}

export interface PlaceWithScores extends Place {
  upvotes: number
  downvotes: number
  score: number
  visit_count: number
  comment_count: number
  user_vote?: number | null
  user_visited?: boolean
  user_saved?: boolean
}

export interface Vote {
  id: string
  place_id: string
  user_id: string
  value: 1 | -1
  created_at: string
}

export interface Visited {
  id: string
  place_id: string
  user_id: string
  visited_at: string
  notes: string | null
  created_at: string
}

export interface Comment {
  id: string
  place_id: string
  user_id: string
  content: string
  approved: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Photo {
  id: string
  place_id: string
  user_id: string
  storage_key: string
  caption: string | null
  width: number | null
  height: number | null
  approved: boolean
  created_at: string
  profiles?: Profile
}

export interface ToddlerTip {
  id: string
  place_id: string
  user_id: string
  tip: string
  created_at: string
  profiles?: Profile
}

export interface ForumThread {
  id: string
  author_id: string
  title: string
  body: string
  category: string
  pinned: boolean
  locked: boolean
  reply_count: number
  last_reply_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface ForumReply {
  id: string
  thread_id: string
  author_id: string
  body: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Meetup {
  id: string
  organiser_id: string
  place_id: string | null
  title: string
  description: string | null
  meetup_date: string
  meetup_time: string | null
  max_attendees: number | null
  created_at: string
  profiles?: Profile
  places?: Place
  rsvp_count?: number
  user_rsvpd?: boolean
}

export interface MeetupRsvp {
  id: string
  meetup_id: string
  user_id: string
  created_at: string
}

export interface SavedPlace {
  id: string
  place_id: string
  user_id: string
  created_at: string
}

export interface WeatherData {
  temperature: number
  weatherCode: number
  windspeed: number
}

export interface PlaceFilters {
  search: string
  area: string
  categoryId: number | null
  freeOnly: boolean
  indoorOnly: boolean
  sortBy: 'score' | 'recent' | 'visits'
}
