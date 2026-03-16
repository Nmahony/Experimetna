-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      text UNIQUE,
  display_name  text,
  avatar_url    text,
  bio           text,
  kids_ages     text[],
  area          text,
  is_admin      boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id    serial PRIMARY KEY,
  slug  text UNIQUE NOT NULL,
  name  text NOT NULL,
  icon  text NOT NULL,
  color text NOT NULL
);

INSERT INTO public.categories (slug, name, icon, color) VALUES
  ('playground', 'Playground',    '🛝', '#22c55e'),
  ('park',       'Park',          '🌳', '#16a34a'),
  ('cafe',       'Café',          '☕', '#d97706'),
  ('soft-play',  'Soft Play',     '🎠', '#9333ea'),
  ('farm',       'Farm',          '🐄', '#ca8a04'),
  ('beach',      'Beach',         '🏖️', '#0ea5e9'),
  ('museum',     'Museum',        '🏛️', '#64748b'),
  ('sports',     'Sports',        '⚽', '#ef4444'),
  ('library',    'Library',       '📚', '#8b5cf6'),
  ('garden',     'Garden',        '🌻', '#84cc16');

-- ============================================================
-- PLACES
-- ============================================================
CREATE TABLE public.places (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             text UNIQUE NOT NULL,
  name             text NOT NULL,
  description      text,
  short_desc       text,
  category_id      int REFERENCES public.categories(id) ON DELETE SET NULL,
  address          text,
  postcode         text,
  lat              numeric(10,7),
  lng              numeric(10,7),
  website          text,
  phone            text,
  opening_hours    jsonb,
  admission        text,
  min_age_months   int NOT NULL DEFAULT 0,
  max_age_years    int NOT NULL DEFAULT 10,
  facilities       text[],
  is_free          boolean NOT NULL DEFAULT false,
  is_indoor        boolean NOT NULL DEFAULT false,
  is_dog_friendly  boolean NOT NULL DEFAULT false,
  area             text,
  cover_image_url  text,
  approved         boolean NOT NULL DEFAULT true,
  submitted_by     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  search_vector    tsvector GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(short_desc, '') || ' ' ||
      coalesce(address, '') || ' ' ||
      coalesce(postcode, '') || ' ' ||
      coalesce(area, '')
    )
  ) STORED
);

CREATE INDEX places_search_idx ON public.places USING GIN(search_vector);
CREATE INDEX places_category_idx ON public.places(category_id);
CREATE INDEX places_area_idx ON public.places(area);
CREATE INDEX places_approved_idx ON public.places(approved);
CREATE INDEX places_slug_idx ON public.places(slug);

-- ============================================================
-- VOTES
-- ============================================================
CREATE TABLE public.votes (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id   uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  value      smallint NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (place_id, user_id)
);

CREATE INDEX votes_place_idx ON public.votes(place_id);
CREATE INDEX votes_user_idx ON public.votes(user_id);

-- ============================================================
-- VISITED
-- ============================================================
CREATE TABLE public.visited (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id   uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visited_at date NOT NULL DEFAULT CURRENT_DATE,
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (place_id, user_id)
);

CREATE INDEX visited_place_idx ON public.visited(place_id);
CREATE INDEX visited_user_idx ON public.visited(user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE public.comments (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id   uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    text NOT NULL,
  approved   boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX comments_place_idx ON public.comments(place_id);
CREATE INDEX comments_user_idx ON public.comments(user_id);

-- ============================================================
-- PHOTOS
-- ============================================================
CREATE TABLE public.photos (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id    uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_key text NOT NULL,
  caption     text,
  width       int,
  height      int,
  approved    boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX photos_place_idx ON public.photos(place_id);

-- ============================================================
-- TODDLER TIPS
-- ============================================================
CREATE TABLE public.toddler_tips (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id   uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tip        text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tips_place_idx ON public.toddler_tips(place_id);

-- ============================================================
-- FORUM THREADS
-- ============================================================
CREATE TABLE public.forum_threads (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         text NOT NULL,
  body          text NOT NULL,
  category      text NOT NULL DEFAULT 'general',
  pinned        boolean NOT NULL DEFAULT false,
  locked        boolean NOT NULL DEFAULT false,
  reply_count   int NOT NULL DEFAULT 0,
  last_reply_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX forum_threads_author_idx ON public.forum_threads(author_id);
CREATE INDEX forum_threads_category_idx ON public.forum_threads(category);
CREATE INDEX forum_threads_created_idx ON public.forum_threads(created_at DESC);

-- ============================================================
-- FORUM REPLIES
-- ============================================================
CREATE TABLE public.forum_replies (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id  uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX forum_replies_thread_idx ON public.forum_replies(thread_id);
CREATE INDEX forum_replies_author_idx ON public.forum_replies(author_id);

-- Trigger to update reply_count and last_reply_at on forum_threads
CREATE OR REPLACE FUNCTION public.update_thread_reply_stats()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.forum_threads
  SET
    reply_count   = reply_count + 1,
    last_reply_at = NEW.created_at,
    updated_at    = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_forum_reply_inserted
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW EXECUTE PROCEDURE public.update_thread_reply_stats();

-- ============================================================
-- MEETUPS
-- ============================================================
CREATE TABLE public.meetups (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organiser_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  place_id      uuid REFERENCES public.places(id) ON DELETE SET NULL,
  title         text NOT NULL,
  description   text,
  meetup_date   date NOT NULL,
  meetup_time   time,
  max_attendees int,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX meetups_organiser_idx ON public.meetups(organiser_id);
CREATE INDEX meetups_date_idx ON public.meetups(meetup_date);

-- ============================================================
-- MEETUP RSVPS
-- ============================================================
CREATE TABLE public.meetup_rsvps (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  meetup_id  uuid NOT NULL REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meetup_id, user_id)
);

CREATE INDEX meetup_rsvps_meetup_idx ON public.meetup_rsvps(meetup_id);
CREATE INDEX meetup_rsvps_user_idx ON public.meetup_rsvps(user_id);

-- ============================================================
-- SAVED PLACES
-- ============================================================
CREATE TABLE public.saved_places (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id   uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (place_id, user_id)
);

CREATE INDEX saved_places_user_idx ON public.saved_places(user_id);

-- ============================================================
-- VIEW: places_with_scores
-- ============================================================
CREATE OR REPLACE VIEW public.places_with_scores AS
SELECT
  p.*,
  COALESCE(SUM(v.value), 0)        AS vote_score,
  COUNT(DISTINCT vi.id)            AS visit_count,
  COUNT(DISTINCT c.id)             AS comment_count,
  COUNT(DISTINCT ph.id)            AS photo_count
FROM public.places p
LEFT JOIN public.votes       v  ON v.place_id  = p.id
LEFT JOIN public.visited     vi ON vi.place_id = p.id
LEFT JOIN public.comments    c  ON c.place_id  = p.id AND c.approved = true
LEFT JOIN public.photos      ph ON ph.place_id = p.id AND ph.approved = true
GROUP BY p.id;
