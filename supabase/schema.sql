-- ===================================================
-- ADAMAS UNIVERSITY ENTREPRENEURSHIP CLUB (E-CLUB)
-- SUPABASE POSTGRESQL SCHEMA & INITIAL SEED
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- 1. EVENTS TABLE
-- ===================================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date VARCHAR(100),
    location VARCHAR(255),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    registration_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 2. NOTICES TABLE
-- ===================================================
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    badge_text VARCHAR(50) DEFAULT 'IMPORTANT NOTICE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 3. CONTACT INQUIRIES TABLE
-- ===================================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 4. ADMIN USERS TABLE
-- ===================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read all events
CREATE POLICY "Public events are viewable by everyone" 
ON public.events FOR SELECT USING (true);

-- Public can read active notices
CREATE POLICY "Public notices are viewable by everyone" 
ON public.notices FOR SELECT USING (true);

-- Public can insert contact inquiries
CREATE POLICY "Anyone can submit contact inquiry" 
ON public.contacts FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) have full access to events, notices, contacts
CREATE POLICY "Admins full access to events" 
ON public.events FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access to notices" 
ON public.notices FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access to contacts" 
ON public.contacts FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access to admin_users" 
ON public.admin_users FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ===================================================
-- SEED INITIAL DATA
-- ===================================================

-- Insert Featured Event
INSERT INTO public.events (title, description, date, location, image_url, is_featured, registration_link)
VALUES (
    'Global Entrepreneurship Summit 2026',
    'Join industry leaders, founders, and innovators for our flagship annual summit featuring keynote speeches, panel discussions, and student startup showcases.',
    'March 15-16, 2026',
    'Main Auditorium, Adamas University Campus',
    '/assets/GES26.webp',
    true,
    '#contact'
) ON CONFLICT DO NOTHING;

-- Insert Active Notice
INSERT INTO public.notices (title, content, is_active, badge_text)
VALUES (
    'Spring 2026 E-Club Membership & Core Committee Recruitment Open!',
    'Applications are now open for dynamic students to join the core operational wings including Innovation & Startups, Event Management, Marketing & PR, and Technical Development.',
    true,
    'IMPORTANT NOTICE'
) ON CONFLICT DO NOTHING;

-- Insert Default Admin (Password: admin123)
-- bcrypt hash for 'admin123': $2a$10$N.Z32wW42gDqEOmO3uJcMeoT3iP1eIvgFhU8Fq0n0e0yL8kX/qgQe
INSERT INTO public.admin_users (username, password_hash, role)
VALUES (
    'admin',
    '$2a$10$N.Z32wW42gDqEOmO3uJcMeoT3iP1eIvgFhU8Fq0n0e0yL8kX/qgQe',
    'superadmin'
) ON CONFLICT (username) DO NOTHING;
