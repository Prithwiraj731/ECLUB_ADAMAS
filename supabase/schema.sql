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
-- 4. STALLS TABLE (RAKHI STARTUP BAZAAR)
-- ===================================================
CREATE TABLE IF NOT EXISTS public.stalls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stall_number VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    founders VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    instagram VARCHAR(255),
    image_url TEXT DEFAULT '/assets/hero/hero1.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 5. STALL REVIEWS TABLE (CONFIDENTIAL VISITOR VOTES)
-- ===================================================
CREATE TABLE IF NOT EXISTS public.stall_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stall_id VARCHAR(100) NOT NULL,
    stall_name VARCHAR(255),
    stall_number VARCHAR(10),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    reviewer_name VARCHAR(255) DEFAULT 'Anonymous Visitor',
    reviewer_contact VARCHAR(255),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 6. ADMIN USERS TABLE
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

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stall_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public notices are viewable by everyone" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public stalls are viewable by everyone" ON public.stalls FOR SELECT USING (true);
CREATE POLICY "Anyone can submit contact inquiry" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit stall review" ON public.stall_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins full access to events" ON public.events FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins full access to notices" ON public.notices FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins full access to contacts" ON public.contacts FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins full access to stalls" ON public.stalls FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins full access to stall_reviews" ON public.stall_reviews FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admins full access to admin_users" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ===================================================
-- SEED INITIAL DATA: 23 OFFICIAL BAZAAR STALLS
-- ===================================================

INSERT INTO public.stalls (stall_number, name, category, founders, department, description, instagram, image_url)
VALUES
    ('01', 'Tangeled Treasures', 'Rakhi & Festive Products', 'Saanwi Singh', 'CSE (SOET) • 3rd Year', 'Handmade crochet products including unique Rakhis, keyrings, charms, and other cute accessories, crafted with love and perfect for gifting.', '@tangeled_treasures', '/assets/rakhi.jpeg'),
    ('02', 'Phool & Dhaga', 'Rakhi & Festive Products', 'Sania Alam', 'Forensic science (School of basic and applied science) • 3rd Year', 'Handmade, eco-friendly crochet products including Rakhis, festive flowers, keychains, and mini pouches. Thoughtfully crafted as cute, affordable, and sustainable gifts using reusable/minimal-waste packaging.', 'moon._child_', '/assets/rakhi.jpeg'),
    ('03', 'The Handmade Heaven', 'Rakhi & Festive Products', 'Aritrika Mandal', 'B.tech Biotechnology (School of Life Science and Biotechnology) • 3rd Year', 'We will be giving handmade scented candle,handcrafted Crochet items and beautiful resin jewellery', '@llamas_aromaticas @stitch_gardenbyparna @anne_shique', '/assets/rakhi.jpeg'),
    ('04', 'Knitflix and chill X Clyra', 'Eco Friendly & Sustainable Items', 'Tiyasha Sen and Subarna Dasgupta', 'Media Studies (School of Media and Communication) • 3rd Year', 'We offer a variety of handmade crochet, fuzzy wire, and clay products, including jewellery, keychains, rakhis, handmade flowers, charms, and other unique handcrafted items. Each product is creatively designed and made with care, making them perfect for gifting or adding a personal touch to your everyday style.', 'https://www.instagram.com/knitflix_chill?igsi=dWF3ZnJ4MWxwYWty and https://www.instagram.com/cly_raofficial?igsi=NzM2dTA2YjR3N3Rq', '/assets/hero/hero3.png'),
    ('05', 'Stixsy', 'Rakhi & Festive Products', 'Abuzar Alam', 'B.Tech (Civil Engineering) (SOET) • 3rd Year', 'STIXSY is a premium merchandise brand offering high-quality vinyl stickers, sticker packs, A4 posters and premium art prints in various themes, including pop culture, sports, anime, music, fashion, gaming and lifestyle. Their products focus on durable materials, premium printing and aesthetic designs for personalizing everyday items and spaces.', 'https://www.instagram.com/stixsyyyy?igsi=MXJxYjYzMmMxOXE4MA==', '/assets/rakhi.jpeg'),
    ('06', 'Rakhi wala corner', 'Rakhi & Festive Products', 'Komal Bothra', 'BA psychology (SOHMS) • 1st Year', 'Rakhi and related to rakhi festive and hampers', 'https://www.instagram.com/_ft.komal._?igsi=dm5uNGkza2U1eWtw', '/assets/rakhi.jpeg'),
    ('07', 'Fusion Clock', 'Homemade Food & Bakery', 'Falguni Yadav', 'M.Tech DSDT (SOET) • 1st Year', 'A delicious homemade cake, freshly baked with love and care. Soft, moist, fluffy, and full of rich, comforting flavor—perfect for birthdays, celebrations, or simply enjoying a sweet treat at home.', 'https://www.instagram.com/fusionclock22?igsi=dmV6YXIzYnV0Zmxy', '/assets/hero/hero2.png'),
    ('08', 'Sweet Stiches', 'Rakhi & Festive Products', 'Tridipa Laskar', 'Management (School Of Business) • 3rd Year', 'We sell Crochet Items, Key chains, Bandana, Rakhi Items and many more', 'https://www.instagram.com/girlinloops?igsi=c2VnbTF1d3U2cmVr', '/assets/rakhi.jpeg'),
    ('09', 'Crunch &Crumbs', 'Homemade Food & Bakery', 'Sayantani Chanda', 'Psychology (SOHMS) • 2nd Year', 'Sandwiches, deepfries, cakes, puddings', 'sayantani.chanda_', '/assets/hero/hero2.png'),
    ('10', 'The Flavour junction', 'Homemade Food & Bakery', 'Rajnandini Kundu', 'B.tech Biotechnology (School of life science and biotechnology) • 3rd Year', 'We will sell byob,chats, sundae ice cream and cold drink', '', '/assets/hero/hero2.png'),
    ('11', 'Handmade & more', 'Eco Friendly & Sustainable Items', 'Prabreesha Dutta', 'BIotechnology (SOLB) • 3rd Year', 'Customized jewellery & gifts, handmade accesaories', '', '/assets/hero/hero3.png'),
    ('12', 'MADE WRAPPED', 'Rakhi & Festive Products', 'PARAMITA MONDAL', 'ALLIED HEALTH SCIENCES (SOHMS) • 4th Year', 'HANDMADE RIBBON ROSE BOUQUETS , CROCHET ACCESSORIES , HAMPERS , BOOKMARKS ETC', 'made_wrapped', '/assets/rakhi.jpeg'),
    ('13', 'kNOT your BRO', 'Homemade Food & Bakery', 'Armaan Kumar Singh', 'CSE (SOET) • 4th Year', 'Homemade cakes, burgers, snacks, meals and sweet treats, made with love at home', 'https://www.instagram.com/seemaplantsandprints?igsi=cXp4bHl4eWh2Zmc5', '/assets/hero/hero2.png'),
    ('14', 'Bring your own babe', 'Homemade Food & Bakery', 'Shana kashish', 'Commerce (Business) • 2nd Year', 'Our BYOB (Bring Your Own Bag) stall offers a fun and customizable snacking experience. Customers can bring their own chips packet or bag, which we transform into a loaded snack by adding fresh vegetables, toppings, sauces and seasonings according to their choice. The concept is interactive, affordable and allows everyone to create their own customized snack.', 'byob_ae', '/assets/hero/hero2.png'),
    ('15', 'Woven by Nilu:"The Rakhi Edition"', 'Rakhi & Festive Products', 'Nilanjana Sinha', 'SoMC Bsc animation,graphics and media technology • 1st Year', 'I sell crochet products at very affordable price specially Rakhis,keychains, hair clips,bookmarkers etc....all are make up of wool ..', 'aira_nilanjana', '/assets/rakhi.jpeg'),
    ('16', 'SOM Perfumes', 'Rakhi & Festive Products', 'Esha Ghosh', 'Bsc in Animation Graphics Design and Media Technology (Media and Communication) • 3rd Year', 'It''s Purely handcrafted Soaps, Perfumes and Attars, with different varieties of fragrances, dupes of Big brands, our own new fragrances, every type of smells available', 'https://www.instagram.com/_scent_o_mania_?igsi=amVpMDJvZnQ4amN2', '/assets/rakhi.jpeg'),
    ('17', 'The Pure Bake', 'Homemade Food & Bakery', 'Priyanshi Bansal', 'Forensic science (SOBAS) • 3rd Year', 'A variety of homemade bakery items including cakes, brownies and cookies!', '@thepurebake', '/assets/hero/hero2.png'),
    ('18', 'HOUSE OF KIOKU', 'Merchandise', 'KANISHK KUMAR RAI', 'BTECH CSE(AI/ML) (SOET) • 3rd Year', 'POSTERS,POLAROIDS AND KEYCHAINS', 'HOUSE OF KIOKU', '/assets/hero/hero1.png'),
    ('19', 'Food affairs', 'Homemade Food & Bakery', 'Archita Koley', 'Allied health and medical science (SOHMS) • 1st Year', 'Eggless cupcakes, mojito, paprichat ,gulaab jamun', 'ku.hu_08', '/assets/hero/hero2.png'),
    ('20', 'Bite Buzz', 'Homemade Food & Bakery', 'Sanchita Jana', 'Allied  health science (SOHMS) • 1st Year', 'Dragon chicken,Medu Vada, Aam panna', '', '/assets/hero/hero2.png'),
    ('21', 'TEAM DIAMOND CHATORE', 'Homemade Food & Bakery', 'SAIKAT BERA', 'Allied health sciences (BMLT) (SOHMS) • 4th Year', 'Tea, verieties of chat,', '_team_diamond_2327', '/assets/hero/hero2.png'),
    ('22', 'Two Peas & A Plate', 'Homemade Food & Bakery', 'Srijani Basu', 'Law (School of law and justice) • 3rd Year', 'Our food is entirely homemade and healthy with taste!!', 'https://www.instagram.com/prioshi_dey?igsi=MWl5Y3RmNWVzNjA1Yg%3D%3D&utm_source=qr', '/assets/hero/hero2.png'),
    ('23', 'Blisbees', 'Merchandise', 'Aaditya Singh', 'BTech Cse (SOET) • 2nd year', 'Diecast car, 3d car frame and gifting items', 'https://www.instagram.com/blisbees?igsi=OXAyaWhmeDJyN3Vr', '/assets/hero/hero1.png')
ON CONFLICT DO NOTHING;

-- Insert Featured Event
INSERT INTO public.events (title, description, date, location, image_url, is_featured, registration_link)
VALUES (
    'RAKHI STARTUP BAZAAR',
    'The Entrepreneurship Club is organising the Rakhi Startup Bazaar — a high-energy platform for students and creators to showcase, validate, and sell handcrafted products & innovative goods while experiencing entrepreneurship beyond the classroom!',
    'Upcoming Campus Exhibition',
    'Adamas University Campus',
    '/assets/rakhi.jpeg',
    true,
    'https://forms.gle/W9u2ewPSW5u2tS7t9'
) ON CONFLICT DO NOTHING;

-- Insert Default Admin (Password: admin123)
INSERT INTO public.admin_users (username, password_hash, role)
VALUES (
    'admin',
    '$2a$10$N.Z32wW42gDqEOmO3uJcMeoT3iP1eIvgFhU8Fq0n0e0yL8kX/qgQe',
    'superadmin'
) ON CONFLICT (username) DO NOTHING;
