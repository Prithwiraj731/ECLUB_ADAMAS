-- ==============================================================================
-- ADAMAS UNIVERSITY ENTREPRENEURSHIP CLUB (E-CLUB) - SUPABASE PRODUCTION SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(100),
    location VARCHAR(255),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    registration_link TEXT DEFAULT '#contact',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    badge_text VARCHAR(100) DEFAULT 'IMPORTANT NOTICE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'superadmin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Stalls Table (Rakhi Startup Bazaar - 30 Dynamic Stalls)
CREATE TABLE IF NOT EXISTS public.stalls (
    id VARCHAR(50) PRIMARY KEY,
    stall_number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    founders VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    instagram VARCHAR(255),
    email VARCHAR(255),
    contact VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Stall Reviews & Live Ratings Table
CREATE TABLE IF NOT EXISTS public.stall_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stall_id VARCHAR(50) NOT NULL REFERENCES public.stalls(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    reviewer_name VARCHAR(255),
    reviewer_contact VARCHAR(100),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_stalls_category ON public.stalls(category);
CREATE INDEX IF NOT EXISTS idx_stall_reviews_stall_id ON public.stall_reviews(stall_id);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS idx_notices_is_active ON public.notices(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stall_reviews ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Public can view events" ON public.events;
CREATE POLICY "Public can view events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view notices" ON public.notices;
CREATE POLICY "Public can view notices" ON public.notices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view stalls" ON public.stalls;
CREATE POLICY "Public can view stalls" ON public.stalls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view reviews" ON public.stall_reviews;
CREATE POLICY "Public can view reviews" ON public.stall_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can submit reviews" ON public.stall_reviews;
CREATE POLICY "Public can submit reviews" ON public.stall_reviews FOR INSERT WITH CHECK (true);

-- Service Role Full Access Policies
DROP POLICY IF EXISTS "Service role full access events" ON public.events;
CREATE POLICY "Service role full access events" ON public.events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access notices" ON public.notices;
CREATE POLICY "Service role full access notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access inquiries" ON public.inquiries;
CREATE POLICY "Service role full access inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access stalls" ON public.stalls;
CREATE POLICY "Service role full access stalls" ON public.stalls FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access stall_reviews" ON public.stall_reviews;
CREATE POLICY "Service role full access stall_reviews" ON public.stall_reviews FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access admins" ON public.admins;
CREATE POLICY "Service role full access admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Default Admin (Password: admin123)
INSERT INTO public.admins (username, password_hash, email, role)
VALUES ('admin', '$2a$10$X8k/pXbU4d1rW5.8QyH0..P8ZfWqI/8N6D5gH1p3z2v1y9k0e2a3u', 'admin@adamas.ac.in', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- 2. Seed Default Featured Events
INSERT INTO public.events (title, description, date, location, image_url, is_featured, registration_link)
VALUES 
(
    'RAKHI STARTUP BAZAAR',
    'The Entrepreneurship Club is organising the Rakhi Startup Bazaar — a high-energy platform for students and creators to showcase, validate, and sell handcrafted products & innovative goods while experiencing entrepreneurship beyond the classroom!',
    'Upcoming Campus Exhibition',
    'Adamas University Campus',
    '/assets/rakhi.jpeg',
    TRUE,
    'https://forms.gle/W9u2ewPSW5u2tS7t9'
),
(
    'HACK-A-VENTURE 48H Hackathon',
    'A 48-hour innovation sprint where student developers and designers collaborate to build functional prototypes for sustainable tech startups.',
    'April 05-07, 2026',
    'Innovation Lab, Block B',
    '/assets/hero/hero1.png',
    FALSE,
    '#contact'
),
(
    'Venture Pitch Bootcamp & Mentorship',
    'Master the art of pitching to angel investors with 1-on-1 mentorship from seasoned startup incubators and faculty mentors.',
    'May 10, 2026',
    'Seminar Hall 3',
    '/assets/hero/hero3.png',
    FALSE,
    '#contact'
)
ON CONFLICT DO NOTHING;

-- 3. Seed Default Notice
INSERT INTO public.notices (title, content, is_active, badge_text)
VALUES (
    'Spring 2026 E-Club Membership & Core Committee Recruitment Open!',
    'Applications are now open for dynamic students to join the core operational wings including Innovation & Startups, Event Management, Marketing & PR, and Technical Development.',
    TRUE,
    'IMPORTANT NOTICE'
)
ON CONFLICT DO NOTHING;

-- 4. Seed All 30 Rakhi Startup Bazaar Stalls
INSERT INTO public.stalls (id, stall_number, name, category, founders, department, description, instagram, email, contact, image_url)
VALUES
('stall_1', '1', 'Tangeled Treasures', 'Rakhi & Festive Products', 'Saanwi Singh', 'CSE (SOET) • 3rd Year', 'Handmade crochet products including unique Rakhis, keyrings, charms, and other cute accessories, crafted with love and perfect for gifting.', '@tangeled_treasures', 'saanwi1.singh@stuadamasuniversity.ac.in', '7439469529', '/assets/rakhi.jpeg'),
('stall_2', '2', 'Phool & Dhaga', 'Rakhi & Festive Products', 'Sania Alam', 'Forensic science (School of basic and applied science) • 3rd Year', 'Handmade, eco-friendly crochet products including Rakhis, festive flowers, keychains, and mini pouches. Thoughtfully crafted as cute, affordable, and sustainable gifts using reusable/minimal-waste packaging.', 'moon._child_', 'drkhurshid1.alamthaniyaalam@stu.adamasuniversity.ac.in', '6290568932', '/assets/rakhi.jpeg'),
('stall_3', '3', 'The Handmade Heaven', 'Rakhi & Festive Products', 'Aritrika Mandal', 'B.tech Biotechnology (School of Life Science and Biotechnology) • 3rd Year', 'We will be giving handmade scented candle,handcrafted Crochet items and beautiful resin jewellery', '@llamas_aromaticas @stitch_gardenbyparna @anne_shique', 'aritrika1.mandal@stu.adamasuniversity.ac. in', '8585844267', '/assets/rakhi.jpeg'),
('stall_4', '4', 'Knitflix and chill X Clyra', 'Eco Friendly & Sustainable Items', 'Tiyasha Sen and Subarna Dasgupta', 'Media Studies (School of Media and Communication) • 3rd Year', 'We offer a variety of handmade crochet, fuzzy wire, and clay products, including jewellery, keychains, rakhis, handmade flowers, charms, and other unique handcrafted items. Each product is creatively designed and made with care, making them perfect for gifting or adding a personal touch to your everyday style.', 'https://www.instagram.com/knitflix_chill?igsi=dWF3ZnJ4MWxwYWty and https://www.instagram.com/cly_raofficial?igsi=NzM2dTA2YjR3N3Rq', 'subarna1.dasgupta@stu.adamasuniversity.ac.in and tiyasha1.sen@stu.adamasuniversity.ac.in', '92424109899123776106', '/assets/hero/hero3.png'),
('stall_5', '5', 'Stixsy', 'Rakhi & Festive Products', 'Abuzar Alam', 'B.Tech (Civil Engineering) (SOET) • 3rd Year', 'STIXSY is a premium merchandise brand offering high-quality vinyl stickers, sticker packs, A4 posters and premium art prints in various themes, including pop culture, sports, anime, music, fashion, gaming and lifestyle. Their products focus on durable materials, premium printing and aesthetic designs for personalizing everyday items and spaces.', 'https://www.instagram.com/stixsyyyy?igsi=MXJxYjYzMmMxOXE4MA==', 'abuzar1.alam@stu.adamasuniversity.ac.in', '7766982866', '/assets/rakhi.jpeg'),
('stall_6', '6', 'Rakhi wala corner', 'Rakhi & Festive Products', 'Komal Bothra', 'BA psychology (SOHMS) • 1st Year', 'Rakhi and related to rakhi festive and hampers', 'https://www.instagram.com/_ft.komal._?igsi=dm5uNGkza2U1eWtw', 'komal.bothra@stu.adamasuniversity.ac.in', '8777647524', '/assets/rakhi.jpeg'),
('stall_7', '7', 'Fusion Clock', 'Homemade Food & Bakery', 'Falguni Yadav', 'M.Tech DSDT (SOET) • 1st Year', 'A delicious homemade cake, freshly baked with love and care. Soft, moist, fluffy, and full of rich, comforting flavor—perfect for birthdays, celebrations, or simply enjoying a sweet treat at home.', 'https://www.instagram.com/fusionclock22?igsi=dmV6YXIzYnV0Zmxy', 'falguni01.yadav@stu.adamasuniversity.ac.in', '7501756156', '/assets/hero/hero2.png'),
('stall_8', '8', 'Sweet Stiches', 'Rakhi & Festive Products', 'Tridipa Laskar', 'Management (School Of Business) • 3rd Year', 'We sell Crochet Items, Key chains, Bandana, Rakhi Items and many more', 'https://www.instagram.com/girlinloops?igsi=c2VnbTF1d3U2cmVr', 'tridipa1.laskar@stu.adamasuniversity.ac.in', '9064474574', '/assets/rakhi.jpeg'),
('stall_9', '9', 'Crunch &Crumbs', 'Homemade Food & Bakery', 'Sayantani Chanda', 'Psychology (SOHMS) • 2nd Year', 'Sandwiches, deepfries, cakes, puddings', 'sayantani.chanda_', 'sayantani2.chanda@stu.adamasuniversity.ac.in', '8240916300', '/assets/hero/hero2.png'),
('stall_10', '10', 'The Flavour junction', 'Homemade Food & Bakery', 'Rajnandini Kundu', 'B.tech Biotechnology (School of life science and biotechnology) • 3rd Year', 'We will sell byob,chats, sundae ice cream and cold drink', 'No', 'rajnandini1.kundu@stu.adamasuniversity.ac.in', '7003856128', '/assets/hero/hero2.png'),
('stall_11', '11', 'Handmade & more', 'Eco Friendly & Sustainable Items', 'Prabreesha Dutta', 'BIotechnology (SOLB) • 3rd Year', 'Customized jewellery & gifts, handmade accesaories', 'NA', 'prabreesha1.dutta@stuadamasuniversity', '9883156225', '/assets/hero/hero3.png'),
('stall_12', '12', 'MADE WRAPPED', 'Rakhi & Festive Products', 'PARAMITA MONDAL', 'ALLIED HEALTH SCIENCES (SOHMS) • 4th Year', 'HANDMADE RIBBON ROSE BOUQUETS , CROCHET ACCESSORIES , HAMPERS , BOOKMARKS ETC', 'made_wrapped', 'paramita.mondal@stu.adamasuniversity.ac.in', '8653530523', '/assets/rakhi.jpeg'),
('stall_13', '13', 'kNOT your BRO', 'Homemade Food & Bakery', 'Armaan Kumar Singh', 'CSE (SOET) • 4th Year', 'Homemade cakes, burgers, snacks, meals and sweet treats, made with love at home', 'https://www.instagram.com/seemaplantsandprints?igsi=cXp4bHl4eWh2Zmc5', 'arman.singh@stu.adamasuniversity.ac.in', '8757477197', '/assets/hero/hero2.png'),
('stall_14', '14', 'Bring your own babe', 'Homemade Food & Bakery', 'Shana kashish', 'Commerce (Business) • 2nd Year', 'Our BYOB (Bring Your Own Bag) stall offers a fun and customizable snacking experience. Customers can bring their own chips packet or bag, which we transform into a loaded snack by adding fresh vegetables, toppings, sauces and seasonings according to their choice. The concept is interactive, affordable and allows everyone to create their own customized snack.', 'byob_ae', 'shana.kashish@stu.adamasuniversity.ac.in', '8709041599', '/assets/hero/hero2.png'),
('stall_15', '15', 'Woven by Nilu:"The Rakhi Edition"', 'Rakhi & Festive Products', 'Nilanjana Sinha', 'SoMC Bsc animation,graphics and media technology • 1st Year', 'I sell crochet products at very affordable price specially Rakhis,keychains, hair clips,bookmarkers etc....all are make up of wool ..', 'aira_nilanjana', 'nilanjana2.sinha@stu.adamasuniversity.ac.in', '7001019700', '/assets/rakhi.jpeg'),
('stall_16', '16', 'SOM Perfumes', 'Rakhi & Festive Products', 'Esha Ghosh', 'Bsc in Animation Graphics Design and Media Technology (Media and Communication) • 3rd Year', 'It''s Purely handcrafted Soaps, Perfumes and Attars, with different varieties of fragrances, dupes of Big brands, our own new fragrances, every type of smells available', 'https://www.instagram.com/_scent_o_mania_?igsi=amVpMDJvZnQ4amN2', 'esha1.ghosh@stu.adamas.university.ac.in', '7890649350', '/assets/rakhi.jpeg'),
('stall_17', '17', 'The Pure Bake', 'Homemade Food & Bakery', 'Priyanshi Bansal', 'Forensic science (SOBAS) • 3rd Year', 'A variety of homemade bakery items including cakes, brownies and cookies!', '@thepurebake', 'priyanshi1.bansal@stu.adamasuniversity.ac.in', '9073399316', '/assets/hero/hero2.png'),
('stall_18', '18', 'HOUSE OF KIOKU', 'Merchandise', 'KANISHK KUMAR RAI', 'BTECH CSE(AI/ML) (SOET) • 3rd Year', 'POSTERS,POLAROIDS AND KEYCHAINS', 'HOUSE OF KIOKU', 'kanishk1.rai@stu.adamasuniversity.ac.in', '9341718471', '/assets/hero/hero1.png'),
('stall_19', '19', 'Food affairs', 'Homemade Food & Bakery', 'Archita Koley', 'Allied health and medical science (SOHMS) • 1st Year', 'Eggless cupcakes, mojito, paprichat ,gulaab jamun', 'ku.hu_08', 'archita2.koley@stu.adamasuniversity.ac.in', '6290860133', '/assets/hero/hero2.png'),
('stall_20', '20', 'Bite Buzz', 'Homemade Food & Bakery', 'Sanchita Jana', 'Allied  health science (SOHMS) • 1st Year', 'Dragon chicken,Medu Vada, Aam panna', 'NA', 'sanchita2.jana@stu.adamasuniversity', '8509482008', '/assets/hero/hero2.png'),
('stall_21', '21', 'TEAM DIAMOND CHATORE', 'Homemade Food & Bakery', 'SAIKAT BERA', 'Allied health sciences (BMLT) (SOHMS) • 4th Year', 'Tea, verieties of chat,', '_team_diamond_2327', 'saikat.bera@stu.adamasuniversity.ac.in', '7478069398', '/assets/hero/hero2.png'),
('stall_22', '22', 'Two Peas & A Plate', 'Homemade Food & Bakery', 'Srijani Basu', 'Law (School of law and justice) • 3rd Year', 'Our food is entirely homemade and healthy with taste!!', 'https://www.instagram.com/prioshi_dey?igsi=MWl5Y3RmNWVzNjA1Yg%3D%3D&utm_source=qr', 'srijani1.basu@stu.adamasuniversity.ac.in', '9332305435', '/assets/hero/hero2.png'),
('stall_23', '23', 'Charmnco', 'Rakhi & Festive Products', 'Saptarshi Kundu', 'CSE (SOET) • 2nd Year', 'Our stall offers a curated collection of cute, trendy, and affordable accessories, including jewellery, bracelets, hair clutches/claw clips, and other stylish little essentials. Perfect for adding a simple touch of charm to your everyday look or gifting someone special.', '@charmnco.official', 'saptarshi1.kundu@stu.adamasuniversity.ac.in', '9330250860', '/assets/rakhi.jpeg'),
('stall_24', '24', 'Faces and Fun', 'Rakhi & Festive Products', 'Prapti Biswas', 'BSc Forensic Science (SOBAS) • 1st Year', 'Face Painting', '', 'prapti.biswas@stu.adamasuniversity.ac.in', '9051625436', '/assets/rakhi.jpeg'),
('stall_25', '25', 'Bloom with Clay', 'Eco Friendly & Sustainable Items', 'Disha Saha', 'Chemistry (Sobas) • 2nd Year', 'We will sell sustainable decorated pots with plants and sustainable candles', 'Null', 'disha2.saha@stu.adamasuniversity.ac.in', '7439299433', '/assets/hero/hero3.png'),
('stall_26', '26', 'আবার খাবো', 'Homemade Food & Bakery', 'Saptarnab Karmakar', 'Environmental science and sustainability (SOBAS) • 1st Year', 'Homemade food', '', 'saptarnab1.karmakar@stu.adamasuniversity.ac.in', '6289091985', '/assets/hero/hero2.png'),
('stall_27', '27', 'Kissewala: Film and Drama Club', 'Eco Friendly & Sustainable Items', 'Debjeet Kundu', 'CSE (SOET) • 2nd Year', 'Creative reels and story making', 'kissewalaofcl_au', 'debjeet1.kundu@stu.adamasuniversity.ac.in', '9073304565', '/assets/hero/hero3.png'),
('stall_28', '28', 'Swaad and Sehat', 'Homemade Food & Bakery', 'Ishita Das', 'Chemistry (School of Basic and Applied Sciences) • 2nd Year', 'We will be selling homemade healthy snacks along with handmade, creative bookmarks', '', 'ishita2.das@stu.adamasuniversity.ac.in', '7044228990', '/assets/hero/hero2.png'),
('stall_29', '29', 'Momolicious!', 'Homemade Food & Bakery', 'RINI KARAK', 'GEOGRAPHY (SOBAS) • 2nd Year', 'Momo', '', 'rini2.karak@stu.adamasuniversity.ac.in', '6290406354', '/assets/hero/hero2.png'),
('stall_30', '30', 'Blisbees', 'Merchandise', 'Aaditya Singh', 'BTech Cse (SOET) • 2nd year', 'Diecast car, 3d car frame and gifting items', 'https://www.instagram.com/blisbees?igsi=OXAyaWhmeDJyN3Vr', 'aditya6.singh@stu.adamasuniversity.ac.in', '9123704457', '/assets/hero/hero1.png')
ON CONFLICT (id) DO UPDATE SET
    stall_number = EXCLUDED.stall_number,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    founders = EXCLUDED.founders,
    department = EXCLUDED.department,
    description = EXCLUDED.description,
    instagram = EXCLUDED.instagram,
    email = EXCLUDED.email,
    contact = EXCLUDED.contact,
    image_url = EXCLUDED.image_url;
