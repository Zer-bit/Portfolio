-- ============================================================================
-- SUPABASE DATABASE SCHEMA & INITIAL SEED DATA (LOW-LEVEL SECURITY MODE)
-- Project: Jezer Parales - Retro Mario Portfolio
-- ============================================================================
-- Instructions:
-- 1. Log in to your Supabase Dashboard (https://supabase.com/dashboard).
-- 2. Go to the SQL Editor tab on the left menu.
-- 3. Click "New Query", paste the entire contents of this file, and click "Run".
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DROP EXISTING TABLES (Safely during setup)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS professional_skills CASCADE;
DROP TABLE IF EXISTS technical_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ----------------------------------------------------------------------------
-- 2. CREATE TABLES
-- ----------------------------------------------------------------------------

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '#',
  accent TEXT NOT NULL DEFAULT '#9cbd09',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Technical Skills Table
CREATE TABLE technical_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Globe',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  color TEXT NOT NULL DEFAULT '#9cbd09',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Professional Skills Table
CREATE TABLE professional_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code',
  color TEXT NOT NULL DEFAULT '#9cbd09',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Experience Table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  overview TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  accent TEXT NOT NULL DEFAULT '#9cbd09',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact Info Table
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  github TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  instagram TEXT NOT NULL,
  viber TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mario Mini-Game Scores Table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS) WITH LOW-LEVEL / PERMISSIVE POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow open read, insert, update, delete for simple management
CREATE POLICY "Low Security Projects Policy" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Low Security Tech Skills Policy" ON technical_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Low Security Prof Skills Policy" ON professional_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Low Security Experience Policy" ON experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Low Security Contact Policy" ON contact_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Low Security Scores Policy" ON scores FOR ALL USING (true) WITH CHECK (true);