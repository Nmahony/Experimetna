-- ============================================================
-- Enable Row Level Security on all tables
-- ============================================================
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visited       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toddler_tips  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_rsvps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (true);

-- ============================================================
-- PLACES
-- ============================================================
CREATE POLICY "places_select_approved" ON public.places
  FOR SELECT USING (approved = true OR auth.uid() = submitted_by);

CREATE POLICY "places_insert_authenticated" ON public.places
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "places_update_own" ON public.places
  FOR UPDATE USING (auth.uid() = submitted_by);

-- ============================================================
-- VOTES
-- ============================================================
CREATE POLICY "votes_select_all" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "votes_insert_own" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_update_own" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "votes_delete_own" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- VISITED
-- ============================================================
CREATE POLICY "visited_select_all" ON public.visited
  FOR SELECT USING (true);

CREATE POLICY "visited_insert_own" ON public.visited
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "visited_delete_own" ON public.visited
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE POLICY "comments_select_approved" ON public.comments
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "comments_insert_own" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_own" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PHOTOS
-- ============================================================
CREATE POLICY "photos_select_approved" ON public.photos
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "photos_insert_own" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photos_delete_own" ON public.photos
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- TODDLER TIPS
-- ============================================================
CREATE POLICY "tips_select_all" ON public.toddler_tips
  FOR SELECT USING (true);

CREATE POLICY "tips_insert_own" ON public.toddler_tips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tips_delete_own" ON public.toddler_tips
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FORUM THREADS
-- ============================================================
CREATE POLICY "forum_threads_select_all" ON public.forum_threads
  FOR SELECT USING (true);

CREATE POLICY "forum_threads_insert_own" ON public.forum_threads
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "forum_threads_update_own" ON public.forum_threads
  FOR UPDATE USING (auth.uid() = author_id);

-- ============================================================
-- FORUM REPLIES
-- ============================================================
CREATE POLICY "forum_replies_select_all" ON public.forum_replies
  FOR SELECT USING (true);

CREATE POLICY "forum_replies_insert_own" ON public.forum_replies
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "forum_replies_update_own" ON public.forum_replies
  FOR UPDATE USING (auth.uid() = author_id);

-- ============================================================
-- MEETUPS
-- ============================================================
CREATE POLICY "meetups_select_all" ON public.meetups
  FOR SELECT USING (true);

CREATE POLICY "meetups_insert_own" ON public.meetups
  FOR INSERT WITH CHECK (auth.uid() = organiser_id);

-- ============================================================
-- MEETUP RSVPS
-- ============================================================
CREATE POLICY "meetup_rsvps_select_all" ON public.meetup_rsvps
  FOR SELECT USING (true);

CREATE POLICY "meetup_rsvps_insert_own" ON public.meetup_rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meetup_rsvps_delete_own" ON public.meetup_rsvps
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SAVED PLACES
-- ============================================================
CREATE POLICY "saved_places_select_own" ON public.saved_places
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_places_insert_own" ON public.saved_places
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_places_delete_own" ON public.saved_places
  FOR DELETE USING (auth.uid() = user_id);
