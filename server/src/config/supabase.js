const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const rawUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
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
        "id": "stall_1",
        "stall_number": "1",
        "name": "Tangeled Treasures",
        "category": "Rakhi & Festive Products",
        "founders": "Saanwi Singh",
        "department": "CSE (SOET) • 3rd Year",
        "description": "Handmade crochet products including unique Rakhis, keyrings, charms, and other cute accessories, crafted with love and perfect for gifting.",
        "instagram": "@tangeled_treasures",
        "email": "saanwi1.singh@stuadamasuniversity.ac.in",
        "contact": "7439469529",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_2",
        "stall_number": "2",
        "name": "Pixie Dust",
        "category": "Rakhi & Festive Products",
        "founders": "Sania Alam",
        "department": "Forensic science (School of basic and applied science) • 3rd Year",
        "description": "Handmade, eco-friendly crochet products including Rakhis, festive flowers, keychains, and mini pouches. Thoughtfully crafted as cute, affordable, and sustainable gifts using reusable/minimal-waste packaging.",
        "instagram": "moon._child_",
        "email": "drkhurshid1.alamthaniyaalam@stu.adamasuniversity.ac.in",
        "contact": "6290568932",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_3",
        "stall_number": "3",
        "name": "The Handmade Heaven",
        "category": "Rakhi & Festive Products",
        "founders": "Aritrika Mandal",
        "department": "B.tech Biotechnology (School of Life Science and Biotechnology) • 3rd Year",
        "description": "We will be giving handmade scented candle,handcrafted Crochet items and beautiful resin jewellery",
        "instagram": "@llamas_aromaticas @stitch_gardenbyparna @anne_shique",
        "email": "aritrika1.mandal@stu.adamasuniversity.ac. in",
        "contact": "8585844267",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_4",
        "stall_number": "4",
        "name": "Knitflix and chill X Clyra",
        "category": "Eco Friendly & Sustainable Items",
        "founders": "Tiyasha Sen and Subarna Dasgupta",
        "department": "Media Studies (School of Media and Communication) • 3rd Year",
        "description": "We offer a variety of handmade crochet, fuzzy wire, and clay products, including jewellery, keychains, rakhis, handmade flowers, charms, and other unique handcrafted items. Each product is creatively designed and made with care, making them perfect for gifting or adding a personal touch to your everyday style.",
        "instagram": "https://www.instagram.com/knitflix_chill?igsi=dWF3ZnJ4MWxwYWty and https://www.instagram.com/cly_raofficial?igsi=NzM2dTA2YjR3N3Rq",
        "email": "subarna1.dasgupta@stu.adamasuniversity.ac.in and tiyasha1.sen@stu.adamasuniversity.ac.in",
        "contact": "92424109899123776106",
        "image_url": "/assets/hero/hero3.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_5",
        "stall_number": "5",
        "name": "Stixsy",
        "category": "Rakhi & Festive Products",
        "founders": "Abuzar Alam",
        "department": "B.Tech (Civil Engineering) (SOET) • 3rd Year",
        "description": "STIXSY is a premium merchandise brand offering high-quality vinyl stickers, sticker packs, A4 posters and premium art prints in various themes, including pop culture, sports, anime, music, fashion, gaming and lifestyle. Their products focus on durable materials, premium printing and aesthetic designs for personalizing everyday items and spaces.",
        "instagram": "https://www.instagram.com/stixsyyyy?igsi=MXJxYjYzMmMxOXE4MA==",
        "email": "abuzar1.alam@stu.adamasuniversity.ac.in",
        "contact": "7766982866",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_6",
        "stall_number": "6",
        "name": "Rakhi wala corner",
        "category": "Rakhi & Festive Products",
        "founders": "Komal Bothra",
        "department": "BA psychology (SOHMS) • 1st Year",
        "description": "Rakhi and related to rakhi festive and hampers",
        "instagram": "https://www.instagram.com/_ft.komal._?igsi=dm5uNGkza2U1eWtw",
        "email": "komal.bothra@stu.adamasuniversity.ac.in",
        "contact": "8777647524",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_7",
        "stall_number": "7",
        "name": "Fusion Clock",
        "category": "Homemade Food & Bakery",
        "founders": "Falguni Yadav",
        "department": "M.Tech DSDT (SOET) • 1st Year",
        "description": "A delicious homemade cake, freshly baked with love and care. Soft, moist, fluffy, and full of rich, comforting flavor—perfect for birthdays, celebrations, or simply enjoying a sweet treat at home.",
        "instagram": "https://www.instagram.com/fusionclock22?igsi=dmV6YXIzYnV0Zmxy",
        "email": "falguni01.yadav@stu.adamasuniversity.ac.in",
        "contact": "7501756156",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_8",
        "stall_number": "8",
        "name": "Thread and Tales",
        "category": "Rakhi & Festive Products",
        "founders": "Tridipa Laskar",
        "department": "Management (School Of Business) • 3rd Year",
        "description": "We sell Crochet Items, Key chains, Bandana, Rakhi Items and many more",
        "instagram": "https://www.instagram.com/girlinloops?igsi=c2VnbTF1d3U2cmVr",
        "email": "tridipa1.laskar@stu.adamasuniversity.ac.in",
        "contact": "9064474574",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_9",
        "stall_number": "9",
        "name": "Crunch &Crumbs",
        "category": "Homemade Food & Bakery",
        "founders": "Sayantani Chanda",
        "department": "Psychology (SOHMS) • 2nd Year",
        "description": "Sandwiches, deepfries, cakes, puddings",
        "instagram": "sayantani.chanda_",
        "email": "sayantani2.chanda@stu.adamasuniversity.ac.in",
        "contact": "8240916300",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_10",
        "stall_number": "10",
        "name": "The Flavour junction",
        "category": "Homemade Food & Bakery",
        "founders": "Rajnandini Kundu",
        "department": "B.tech Biotechnology (School of life science and biotechnology) • 3rd Year",
        "description": "We will sell byob,chats, sundae ice cream and cold drink",
        "instagram": "No",
        "email": "rajnandini1.kundu@stu.adamasuniversity.ac.in",
        "contact": "7003856128",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_11",
        "stall_number": "11",
        "name": "Handmade & more",
        "category": "Eco Friendly & Sustainable Items",
        "founders": "Prabreesha Dutta",
        "department": "BIotechnology (SOLB) • 3rd Year",
        "description": "Customized jewellery & gifts, handmade accesaories",
        "instagram": "NA",
        "email": "prabreesha1.dutta@stuadamasuniversity",
        "contact": "9883156225",
        "image_url": "/assets/hero/hero3.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_12",
        "stall_number": "12",
        "name": "MADE WRAPPED",
        "category": "Rakhi & Festive Products",
        "founders": "PARAMITA MONDAL",
        "department": "ALLIED HEALTH SCIENCES (SOHMS) • 4th Year",
        "description": "HANDMADE RIBBON ROSE BOUQUETS , CROCHET ACCESSORIES , HAMPERS , BOOKMARKS ETC",
        "instagram": "made_wrapped",
        "email": "paramita.mondal@stu.adamasuniversity.ac.in",
        "contact": "8653530523",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_13",
        "stall_number": "13",
        "name": "kNOT your BRO",
        "category": "Homemade Food & Bakery",
        "founders": "Armaan Kumar Singh",
        "department": "CSE (SOET) • 4th Year",
        "description": "Homemade cakes, burgers, snacks, meals and sweet treats, made with love at home",
        "instagram": "https://www.instagram.com/seemaplantsandprints?igsi=cXp4bHl4eWh2Zmc5",
        "email": "arman.singh@stu.adamasuniversity.ac.in",
        "contact": "8757477197",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_14",
        "stall_number": "14",
        "name": "Scoopy Secrets",
        "category": "Homemade Food & Bakery",
        "founders": "Shana kashish",
        "department": "Commerce (Business) • 2nd Year",
        "description": "Our BYOB (Bring Your Own Bag) stall offers a fun and customizable snacking experience. Customers can bring their own chips packet or bag, which we transform into a loaded snack by adding fresh vegetables, toppings, sauces and seasonings according to their choice. The concept is interactive, affordable and allows everyone to create their own customized snack.",
        "instagram": "byob_ae",
        "email": "shana.kashish@stu.adamasuniversity.ac.in",
        "contact": "8709041599",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_15",
        "stall_number": "15",
        "name": "Woven by Nilu:\"The Rakhi Edition\"",
        "category": "Rakhi & Festive Products",
        "founders": "Nilanjana Sinha",
        "department": "SoMC Bsc animation,graphics and media technology • 1st Year",
        "description": "I sell crochet products at very affordable price specially Rakhis,keychains, hair clips,bookmarkers etc....all are make up of wool ..",
        "instagram": "aira_nilanjana",
        "email": "nilanjana2.sinha@stu.adamasuniversity.ac.in",
        "contact": "7001019700",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_16",
        "stall_number": "16",
        "name": "SOM Perfumes",
        "category": "Rakhi & Festive Products",
        "founders": "Esha Ghosh",
        "department": "Bsc in Animation Graphics Design and Media Technology (Media and Communication) • 3rd Year",
        "description": "It's Purely handcrafted Soaps, Perfumes and Attars, with different varieties of fragrances, dupes of Big brands, our own new fragrances, every type of smells available",
        "instagram": "https://www.instagram.com/_scent_o_mania_?igsi=amVpMDJvZnQ4amN2",
        "email": "esha1.ghosh@stu.adamas.university.ac.in",
        "contact": "7890649350",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_17",
        "stall_number": "17",
        "name": "The Pure Bake",
        "category": "Homemade Food & Bakery",
        "founders": "Priyanshi Bansal",
        "department": "Forensic science (SOBAS) • 3rd Year",
        "description": "A variety of homemade bakery items including cakes, brownies and cookies!",
        "instagram": "@thepurebake",
        "email": "priyanshi1.bansal@stu.adamasuniversity.ac.in",
        "contact": "9073399316",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_18",
        "stall_number": "18",
        "name": "HOUSE OF KIOKU",
        "category": "Merchandise",
        "founders": "KANISHK KUMAR RAI",
        "department": "BTECH CSE(AI/ML) (SOET) • 3rd Year",
        "description": "POSTERS,POLAROIDS AND KEYCHAINS",
        "instagram": "HOUSE OF KIOKU",
        "email": "kanishk1.rai@stu.adamasuniversity.ac.in",
        "contact": "9341718471",
        "image_url": "/assets/hero/hero1.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_19",
        "stall_number": "19",
        "name": "Food affairs",
        "category": "Homemade Food & Bakery",
        "founders": "Archita Koley",
        "department": "Allied health and medical science (SOHMS) • 1st Year",
        "description": "Eggless cupcakes, mojito, paprichat ,gulaab jamun",
        "instagram": "ku.hu_08",
        "email": "archita2.koley@stu.adamasuniversity.ac.in",
        "contact": "6290860133",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_20",
        "stall_number": "20",
        "name": "Bite Buzz",
        "category": "Homemade Food & Bakery",
        "founders": "Sanchita Jana",
        "department": "Allied  health science (SOHMS) • 1st Year",
        "description": "Dragon chicken,Medu Vada, Aam panna",
        "instagram": "NA",
        "email": "sanchita2.jana@stu.adamasuniversity",
        "contact": "8509482008",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_21",
        "stall_number": "21",
        "name": "TEAM DIAMOND CHATORE",
        "category": "Homemade Food & Bakery",
        "founders": "SAIKAT BERA",
        "department": "Allied health sciences (BMLT) (SOHMS) • 4th Year",
        "description": "Tea, verieties of chat,",
        "instagram": "_team_diamond_2327",
        "email": "saikat.bera@stu.adamasuniversity.ac.in",
        "contact": "7478069398",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_22",
        "stall_number": "22",
        "name": "Two Peas & A Plate",
        "category": "Homemade Food & Bakery",
        "founders": "Srijani Basu",
        "department": "Law (School of law and justice) • 3rd Year",
        "description": "Our food is entirely homemade and healthy with taste!!",
        "instagram": "https://www.instagram.com/prioshi_dey?igsi=MWl5Y3RmNWVzNjA1Yg%3D%3D&utm_source=qr",
        "email": "srijani1.basu@stu.adamasuniversity.ac.in",
        "contact": "9332305435",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_23",
        "stall_number": "23",
        "name": "Charmnco",
        "category": "Rakhi & Festive Products",
        "founders": "Saptarshi Kundu",
        "department": "CSE (SOET) • 2nd Year",
        "description": "Our stall offers a curated collection of cute, trendy, and affordable accessories, including jewellery, bracelets, hair clutches/claw clips, and other stylish little essentials. Perfect for adding a simple touch of charm to your everyday look or gifting someone special.",
        "instagram": "@charmnco.official",
        "email": "saptarshi1.kundu@stu.adamasuniversity.ac.in",
        "contact": "9330250860",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_24",
        "stall_number": "24",
        "name": "Chitra Chatter",
        "category": "Rakhi & Festive Products",
        "founders": "Prapti Biswas",
        "department": "BSc Forensic Science (SOBAS) • 1st Year",
        "description": "Face Painting",
        "instagram": "",
        "email": "prapti.biswas@stu.adamasuniversity.ac.in",
        "contact": "9051625436",
        "image_url": "/assets/rakhi.jpeg",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_25",
        "stall_number": "25",
        "name": "Bloom with Clay",
        "category": "Eco Friendly & Sustainable Items",
        "founders": "Disha Saha",
        "department": "Chemistry (Sobas) • 2nd Year",
        "description": "We will sell sustainable decorated pots with plants and sustainable candles",
        "instagram": "Null",
        "email": "disha2.saha@stu.adamasuniversity.ac.in",
        "contact": "7439299433",
        "image_url": "/assets/hero/hero3.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_26",
        "stall_number": "26",
        "name": "হেঁশেল কথা",
        "category": "Homemade Food & Bakery",
        "founders": "Saptarnab Karmakar",
        "department": "Environmental science and sustainability (SOBAS) • 1st Year",
        "description": "Homemade food",
        "instagram": "",
        "email": "saptarnab1.karmakar@stu.adamasuniversity.ac.in",
        "contact": "6289091985",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_27",
        "stall_number": "27",
        "name": "Kissewala: Film and Drama Club",
        "category": "Eco Friendly & Sustainable Items",
        "founders": "Debjeet Kundu",
        "department": "CSE (SOET) • 2nd Year",
        "description": "Creative reels and story making",
        "instagram": "kissewalaofcl_au",
        "email": "debjeet1.kundu@stu.adamasuniversity.ac.in",
        "contact": "9073304565",
        "image_url": "/assets/hero/hero3.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_28",
        "stall_number": "28",
        "name": "Swaad and Sehat",
        "category": "Homemade Food & Bakery",
        "founders": "Ishita Das",
        "department": "Chemistry (School of Basic and Applied Sciences) • 2nd Year",
        "description": "We will be selling homemade healthy snacks along with handmade, creative bookmarks",
        "instagram": "",
        "email": "ishita2.das@stu.adamasuniversity.ac.in",
        "contact": "7044228990",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_29",
        "stall_number": "29",
        "name": "Momolicious!",
        "category": "Homemade Food & Bakery",
        "founders": "RINI KARAK",
        "department": "GEOGRAPHY (SOBAS) • 2nd Year",
        "description": "Momo",
        "instagram": "",
        "email": "rini2.karak@stu.adamasuniversity.ac.in",
        "contact": "6290406354",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_30",
        "stall_number": "30",
        "name": "Blisbees",
        "category": "Merchandise",
        "founders": "Aaditya Singh",
        "department": "BTech Cse (SOET) • 2nd year",
        "description": "Diecast car, 3d car frame and gifting items",
        "instagram": "https://www.instagram.com/blisbees?igsi=OXAyaWhmeDJyN3Vr",
        "email": "aditya6.singh@stu.adamasuniversity.ac.in",
        "contact": "9123704457",
        "image_url": "/assets/hero/hero1.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_31",
        "stall_number": "31",
        "name": "Chatpata Adda",
        "category": "Homemade Food & Bakery",
        "founders": "Rajbir Saha",
        "department": "Adamas University • Student Team",
        "description": "Delicious & mouth-watering chatpata snacks, savory street treats & refreshments.",
        "instagram": "",
        "email": "",
        "contact": "",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    },
    {
        "id": "stall_32",
        "stall_number": "32",
        "name": "B.Tech Momowala",
        "category": "Homemade Food & Bakery",
        "founders": "Sampad Ghosh",
        "department": "B.Tech • Adamas University",
        "description": "Special homemade momos, delicious steamed & fried dumplings served with authentic spicy chutney and special seasoning.",
        "instagram": "",
        "email": "",
        "contact": "",
        "image_url": "/assets/hero/hero2.png",
        "created_at": "2026-08-25T10:00:00.000Z"
    }
],
  stall_reviews: [],
  admins: [
    {
      id: 'a1',
      username: 'admin',
      // Password hash for: admin123
      password_hash: '$2a$10$rCv1N5l2M18eF.8O4.4WpuNzgK4rLhD3LpZ3M5.aT8a6q8hL.Lgq2',
      email: 'admin@adamas.ac.in',
      role: 'superadmin',
      created_at: new Date().toISOString()
    }
  ]
};

// Initialize real Supabase client if valid credentials are provided
if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your-project-ref')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    isMock = false;
    console.log('⚡ Connected to real Supabase database successfully.');
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase client, using in-memory mock store:', err.message);
    isMock = true;
  }
} else {
  console.log('ℹ️ Running with in-memory database store (Supabase credentials not configured in server/.env).');
  isMock = true;
}

module.exports = {
  supabase,
  isMock,
  mockStore
};
