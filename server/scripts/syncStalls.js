const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const updatedStalls = [
  {
    id: 'stall_2',
    stall_number: '2',
    name: 'Pixie Dust',
    category: 'Rakhi & Festive Products',
    founders: 'Sania Alam',
    department: 'Forensic science (School of basic and applied science) • 3rd Year',
    description: 'Handmade, eco-friendly crochet products including Rakhis, festive flowers, keychains, and mini pouches. Thoughtfully crafted as cute, affordable, and sustainable gifts using reusable/minimal-waste packaging.',
    instagram: 'moon._child_',
    email: 'drkhurshid1.alamthaniyaalam@stu.adamasuniversity.ac.in',
    contact: '6290568932',
    image_url: '/assets/rakhi.jpeg'
  },
  {
    id: 'stall_14',
    stall_number: '14',
    name: 'Scoopy Secrets',
    category: 'Homemade Food & Bakery',
    founders: 'Shana kashish',
    department: 'Commerce (Business) • 2nd Year',
    description: 'Our BYOB (Bring Your Own Bag) stall offers a fun and customizable snacking experience. Customers can bring their own chips packet or bag, which we transform into a loaded snack by adding fresh vegetables, toppings, sauces and seasonings according to their choice. The concept is interactive, affordable and allows everyone to create their own customized snack.',
    instagram: 'byob_ae',
    email: 'shana.kashish@stu.adamasuniversity.ac.in',
    contact: '8709041599',
    image_url: '/assets/hero/hero2.png'
  },
  {
    id: 'stall_26',
    stall_number: '26',
    name: 'হেঁশেল কথা',
    category: 'Homemade Food & Bakery',
    founders: 'Saptarnab Karmakar',
    department: 'Environmental science and sustainability (SOBAS) • 1st Year',
    description: 'Homemade food',
    instagram: '',
    email: 'saptarnab1.karmakar@stu.adamasuniversity.ac.in',
    contact: '6289091985',
    image_url: '/assets/hero/hero2.png'
  },
  {
    id: 'stall_31',
    stall_number: '31',
    name: 'Chatpata Adda',
    category: 'Homemade Food & Bakery',
    founders: 'Rajbir Saha',
    department: 'Adamas University • Student Team',
    description: 'Delicious & mouth-watering chatpata snacks, savory street treats & refreshments.',
    instagram: '',
    email: '',
    contact: '',
    image_url: '/assets/hero/hero2.png'
  },
  {
    id: 'stall_32',
    stall_number: '32',
    name: 'B.Tech Momowala',
    category: 'Homemade Food & Bakery',
    founders: 'Sampad Ghosh',
    department: 'B.Tech • Adamas University',
    description: 'Special homemade momos, delicious steamed & fried dumplings served with authentic spicy chutney and special seasoning.',
    instagram: '',
    email: '',
    contact: '',
    image_url: '/assets/hero/hero2.png'
  }
];

async function run() {
  console.log('Connecting to Supabase:', supabaseUrl);

  for (const stall of updatedStalls) {
    console.log(`Upserting stall #${stall.stall_number} (${stall.name})...`);
    const { data, error } = await supabase
      .from('stalls')
      .upsert(stall, { onConflict: 'id' })
      .select();

    if (error) {
      console.error(`Error with stall #${stall.stall_number}:`, error);
    } else {
      console.log(`✅ Stall #${stall.stall_number} (${stall.name}) saved in Supabase:`, data);
    }
  }

  // Fetch all stalls to verify count and list
  const { data: allStalls, error: listErr } = await supabase
    .from('stalls')
    .select('stall_number, name')
    .order('stall_number', { ascending: true });

  if (listErr) {
    console.error('Error fetching list:', listErr);
  } else {
    console.log(`\n🎉 Total Stalls currently in Supabase database: ${allStalls.length}`);
    console.log(allStalls);
  }
}

run();
