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

-- ----------------------------------------------------------------------------
-- 4. STORAGE BUCKET FOR PORTFOLIO IMAGES
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Upload Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Update Storage" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Delete Storage" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-assets');

-- ----------------------------------------------------------------------------
-- 5. SEED INITIAL DATA
-- ----------------------------------------------------------------------------

-- Seed Projects
INSERT INTO projects (title, slug, description, tech, image, link, accent, order_index) VALUES
(
  'Inspire Holdings Incorporated',
  'inspire-holdings-incorporated',
  'A comprehensive corporate website showcasing company services, portfolio, and client engagement features with modern design and seamless user experience.',
  '["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"]'::jsonb,
  '/Images/IHI.png',
  'https://www.inspireholdings.ph/',
  '#9cbd09',
  1
),
(
  'iPageant Inspire',
  'ipageant-inspire',
  'A dynamic pageant management platform featuring contestant profiles, event scheduling, and interactive voting system with real-time updates.',
  '["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"]'::jsonb,
  '/Images/inspirepageant.png',
  'https://pageant-inspire.vercel.app/',
  '#0ea5e9',
  2
),
(
  'SHS Club Management System',
  'shs-club-management-system',
  'A centralized platform for managing student clubs, memberships, and school activities with administrative controls and real-time record tracking.',
  '["HTML", "CSS", "JavaScript", "PHP", "MySQL"]'::jsonb,
  '/Images/shsclub.png',
  '#',
  '#f97316',
  3
),
(
  'void',
  'void',
  'An advanced Android music player that lets you browse and convert video media into high-quality audio files for offline listening. Powered by a high-performance Rust core via FFI.',
  '["Dart", "Rust", "Flutter", "Android SDK", "FFI", "FFmpeg"]'::jsonb,
  '/Images/void-img.jpeg',
  '#',
  '#9cbd09',
  4
),
(
  'Youtube mp3 API',
  'youtube-mp3-api',
  'A high-performance API service designed to fetch and convert YouTube video data into high-quality MP3 or M4A formats, written in Rust for optimal execution speed.',
  '["Rust", "REST API", "YouTube API", "JSON"]'::jsonb,
  '/Images/youtube-mp3-api.svg',
  '#',
  '#0ea5e9',
  5
),
(
  'Inspire Book Slider',
  'inspire-book-slider',
  'An interactive digital annual report featuring a sophisticated book-slider interface, providing an engaging and immersive reading experience for corporate disclosures.',
  '["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"]'::jsonb,
  '/Images/inspire-annual-report-img.png',
  'https://inspire-book-slider.vercel.app/',
  '#f97316',
  6
);

-- Seed Technical Skills
INSERT INTO technical_skills (name, icon, items, color, order_index) VALUES
(
  'Frontend Development',
  'Globe',
  '["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"]'::jsonb,
  '#9cbd09',
  1
),
(
  'Mobile Development',
  'Smartphone',
  '["Flutter", "Dart", "React Native"]'::jsonb,
  '#0ea5e9',
  2
),
(
  'Backend & Cloud',
  'Cpu',
  '["Node.js", "C#", "Rust", "Firebase", "Supabase", "PostgreSQL", "MySQL", "REST API", "Redis"]'::jsonb,
  '#f97316',
  3
),
(
  'DevOps & Tools',
  'Rocket',
  '["Git", "Github", "Docker", "Vercel", "EmailJS", "Google Apps Script", "SSMS", "Visual Studio 2022", "Visual Studio Code", "NetBeans", "Unity", "Oracle VirtualBox"]'::jsonb,
  '#0ea5e9',
  4
),
(
  'Cybersecurity & OS',
  'Shield',
  '["Linux Kernel", "Kali Linux", "Ubuntu", "Windows", "Fedora"]'::jsonb,
  '#9cbd09',
  5
);

-- Seed Professional Skills
INSERT INTO professional_skills (name, description, icon, color, order_index) VALUES
(
  'Technical Leadership',
  'Executing complex projects with precision and problem-solving.',
  'Code',
  '#9cbd09',
  1
),
(
  'UI/UX Design',
  'Creating intuitive and premium user interfaces.',
  'Palette',
  '#f97316',
  2
),
(
  'Communication & Collaboration',
  'Strong verbal and written skills with active listening. Effective team coordination and independent work.',
  'Briefcase',
  '#0ea5e9',
  3
),
(
  'Customer Service',
  'Dedicated to delivering exceptional client experiences.',
  'Code',
  '#f97316',
  4
),
(
  'Time Management',
  'Strong organizational and time management skills.',
  'Palette',
  '#9cbd09',
  5
),
(
  'Adaptability',
  'Quick to learn and adapt to new technologies, tools, and challenges. If I don''t know something, I''ll figure it out.',
  'Rocket',
  '#0ea5e9',
  6
);

-- Seed Experience
INSERT INTO experience (job_title, company, start_date, end_date, overview, details, projects, tech, accent, order_index) VALUES
(
  'Technical Executive Secretary',
  'Inspire Holdings Incorporated',
  'May 2026',
  'Present',
  'Execute a unique, hybrid role combining high-level executive administrative support with technical asset management, digital maintenance, and secretarial operations.',
  '["Streamline daily executive functions by managing corporate schedules, high-priority communications, and documentation with precision.", "Maintain company digital systems, including web portals, domain assets, and database backups, ensuring maximum operational uptime.", "Optimize record-keeping by designing secure, structured digital archives for confidential corporate and technical documents."]'::jsonb,
  '[]'::jsonb,
  '["Technical Operations", "Digital Maintenance", "Database Management", "Google Workspace", "Office Productivity Tools"]'::jsonb,
  '#f97316',
  1
),
(
  'Full Stack Developer',
  'Inspire Holdings Incorporated',
  'Jan 2026',
  'May 2026',
  'Designed and built websites for business clients, managing both the front-end layout and backend storage. Focused on turning customer ideas into fully working web platforms.',
  '["Created the official company website to establish a clean and professional online presence.", "Developed a pageant management website with profile pages, event schedules, and real-time voting.", "Collaborated directly with business clients to draft layouts, design screens, and publish websites.", "Set up database systems and online connections to handle user accounts and interactive features."]'::jsonb,
  '[{"title": "Inspire Holdings Incorporated", "link": "https://www.inspireholdings.ph/"}, {"title": "iPageant Inspire", "link": "https://pageant-inspire.vercel.app/"}]'::jsonb,
  '["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS", "APIs"]'::jsonb,
  '#9cbd09',
  2
),
(
  'Freelance Web Developer',
  'Self-Employed',
  '2024',
  'Present',
  'Created custom websites and web systems for small businesses, schools, and personal projects. Managed every step of the work, from drawing layouts to writing code, setting up databases, and launching websites.',
  '["Developed the Inspire Book Slider, an interactive digital annual report website utilizing React, Next.js, and Framer Motion.", "Created the YouTube mp3 API to handle video searching and audio conversions using Node.js and REST APIs.", "Built the SHS Club Management System, integrating custom user interfaces with vanilla and MySQL database storage.", "Leveraged Supabase and PostgreSQL to design secure database schemas and user login flows for freelance clients.", "Utilized Docker to containerize development environments and Git/Vercel for version control and website deployment."]'::jsonb,
  '[{"title": "Inspire Book Slider", "link": "https://inspire-book-slider.vercel.app/"}, {"title": "Youtube mp3 API"}, {"title": "SHS Club Management System"}]'::jsonb,
  '["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "MySQL", "Supabase", "PostgreSQL", "REST API", "Docker", "Git", "Vercel"]'::jsonb,
  '#0ea5e9',
  3
),
(
  'Mobile App Developer',
  'Personal Project',
  '2025',
  'Present',
  'Built and launched mobile apps for offline media playback and video search tools. Guided the entire development process from visual layout design to releasing on app stores.',
  '["Built ''void'', an Android music player that lets users download and play audio files offline without internet.", "Added search features to help users find, search, and catalog their favorite music tracks easily.", "Used media conversion tools to let users save audio files in different formats directly on their devices.", "Designed app screens, wrote the backend logic, improved app speed, and managed new updates."]'::jsonb,
  '[{"title": "void"}]'::jsonb,
  '["Flutter", "Dart", "Android SDK", "YouTube Data API", "FFmpeg", "State Management"]'::jsonb,
  '#f97316',
  4
);

-- Seed Contact Info
INSERT INTO contact_info (email, phone, github, linkedin, instagram, viber) VALUES
(
  'jezermantilla263026@gmail.com',
  '+63 976 389 1702',
  'https://github.com/Zer-bit',
  'https://www.linkedin.com/in/jezer-parales-201488386',
  'https://www.instagram.com/zeretsui/',
  'viber://chat?number=+639763891702'
);
