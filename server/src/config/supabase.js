const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isMock = true;

// In-memory fallback mock database store for seamless offline/local preview
const mockStore = {
  events: [
    {
      id: 'e1',
      title: 'RAKHI STARTUP BAZAAR',
      description:
        'The Entrepreneurship Club is organising the Rakhi Startup Bazaar — a high-energy platform for students and creators to showcase, validate, and sell handcrafted products & innovative goods while experiencing entrepreneurship beyond the classroom!',
      date: 'Upcoming Campus Exhibition',
      location: 'Adamas University Campus',
      image_url: '/assets/rakhi.jpeg',
      is_featured: true,
      registration_link: 'https://forms.gle/W9u2ewPSW5u2tS7t9',
      created_at: new Date().toISOString()
    },
    {
      id: 'e2',
      title: 'HACK-A-VENTURE 48H Hackathon',
      description: 'A 48-hour innovation sprint where student developers and designers collaborate to build functional prototypes for sustainable tech startups.',
      date: 'April 05-07, 2026',
      location: 'Innovation Lab, Block B',
      image_url: '/assets/hero/hero1.png',
      is_featured: false,
      registration_link: '#contact',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'e3',
      title: 'Venture Pitch Bootcamp & Mentorship',
      description: 'Master the art of pitching to angel investors with 1-on-1 mentorship from seasoned startup incubators and faculty mentors.',
      date: 'May 10, 2026',
      location: 'Seminar Hall 3',
      image_url: '/assets/hero/hero3.png',
      is_featured: false,
      registration_link: '#contact',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  notices: [
    {
      id: 'n1',
      title: 'Spring 2026 E-Club Membership & Core Committee Recruitment Open!',
      content: 'Applications are now open for dynamic students to join the core operational wings including Innovation & Startups, Event Management, Marketing & PR, and Technical Development.',
      is_active: true,
      badge_text: 'IMPORTANT NOTICE',
      created_at: new Date().toISOString()
    }
  ],
  contacts: [],
  stalls: [
    {
      id: 'stall_1',
      stall_number: '01',
      name: 'Dhaaga & Craft Studio',
      category: 'Handcrafted Rakhi & Gifts',
      founders: 'Pooja Roy & Team',
      description: 'Exclusive handmade designer Rakhis, organic thread bracelets, and customized festive gift hampers made with sustainable materials.',
      image_url: '/assets/hero/hero1.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'stall_2',
      stall_number: '02',
      name: 'The Festive Bakers',
      category: 'Food & Beverages',
      founders: 'Aditya Sen & Ananya',
      description: 'Freshly baked artisanal cookies, chocolate treats, festive cupcakes, and handcrafted dry fruit sweets.',
      image_url: '/assets/hero/hero2.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'stall_3',
      stall_number: '03',
      name: 'Resin & Clay Arts',
      category: 'Art & Lifestyle',
      founders: 'Debasmita Mukherjee',
      description: 'Unique custom resin keychains, handmade clay jewelry, decorative festive trays, and custom bookmarks.',
      image_url: '/assets/hero/hero3.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'stall_4',
      stall_number: '04',
      name: 'Aura Accessories & Jewels',
      category: 'Fashion & Accessories',
      founders: 'Sneha Guha & Ritu',
      description: 'Modern minimalist jewelry, ethnic statement earrings, hand-beaded wristbands, and aesthetic festival accessories.',
      image_url: '/assets/hero/hero1.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'stall_5',
      stall_number: '05',
      name: 'ByteCraft Tech Creations',
      category: 'Tech & Innovations',
      founders: 'Souvik Paul & Tech Wing',
      description: 'Custom 3D printed desk trinkets, smart LED badges, and tech accessories designed by engineering students.',
      image_url: '/assets/hero/hero2.png',
      created_at: new Date().toISOString()
    },
    {
      id: 'stall_6',
      stall_number: '06',
      name: 'Organic Refresh & Sip',
      category: 'Food & Beverages',
      founders: 'Rohit Das & Group',
      description: 'Chilled organic mocktails, iced herbal infusions, traditional festive thandai, and savory festival snacks.',
      image_url: '/assets/hero/hero3.png',
      created_at: new Date().toISOString()
    }
  ],
  stall_reviews: [],
  admins: [
    {
      id: 'a1',
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'superadmin'
    }
  ]
};

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your-project-ref')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isMock = false;
    console.log('✅ Supabase client initialized with live database connection.');
  } catch (error) {
    console.warn('⚠️ Supabase initialization failed, falling back to in-memory store:', error.message);
    isMock = true;
  }
} else {
  console.log('ℹ️ Supabase credentials not set in .env. Running in in-memory Mock Data mode for development.');
}

module.exports = {
  supabase,
  isMock,
  mockStore
};
