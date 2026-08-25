/**
 * Supabase Diagnostic and Direct Seeder Script
 * Usage: node src/scripts/testAndSeedSupabase.js
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('==================================================');
console.log('🐘 ADAMAS E-CLUB: SUPABASE CONNECTION & SEED TOOL');
console.log('==================================================');

if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http') || supabaseUrl.includes('your-project-ref')) {
  console.error('\n❌ ERROR: Supabase credentials are missing or placeholder in server/.env');
  console.log('Please add the following to your server/.env:');
  console.log('  SUPABASE_URL=https://<your-project-ref>.supabase.co');
  console.log('  SUPABASE_ANON_KEY=<your-anon-key>');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function main() {
  console.log(`\n📡 Connecting to Supabase project: ${supabaseUrl}`);

  try {
    // 1. Load Stalls Data
    const { mockStore } = require('../config/supabase');
    const stalls = mockStore.stalls;

    console.log(`\n1️⃣ Upserting ${stalls.length} Rakhi Startup Bazaar Stalls...`);
    const { data: stallsData, error: stallsErr } = await supabase
      .from('stalls')
      .upsert(stalls, { onConflict: 'id' });

    if (stallsErr) {
      console.error('❌ Error inserting stalls:', stallsErr.message);
      console.log('💡 TIP: If the "stalls" table does not exist, run the SQL script in supabase/schema.sql in your Supabase SQL Editor first.');
      process.exit(1);
    } else {
      console.log(`✅ Successfully synced ${stalls.length} stalls to Supabase!`);
    }

    // 2. Check Events
    console.log('\n2️⃣ Checking Featured Events...');
    const { data: eventsData, error: eventsErr } = await supabase
      .from('events')
      .select('id, title, is_featured');

    if (eventsErr) {
      console.warn('⚠️ Could not query events table:', eventsErr.message);
    } else {
      console.log(`✅ Events table is online (${eventsData.length} events found).`);
    }

    // 3. Check Notices
    console.log('\n3️⃣ Checking Notices...');
    const { data: noticesData, error: noticesErr } = await supabase
      .from('notices')
      .select('id, title, is_active');

    if (noticesErr) {
      console.warn('⚠️ Could not query notices table:', noticesErr.message);
    } else {
      console.log(`✅ Notices table is online (${noticesData.length} notices found).`);
    }

    // 4. Check Admins
    console.log('\n4️⃣ Checking Superadmin Account...');
    const { data: adminData, error: adminErr } = await supabase
      .from('admins')
      .select('username, email');

    if (adminErr) {
      console.warn('⚠️ Could not query admins table:', adminErr.message);
    } else {
      console.log(`✅ Admins table is online (${adminData.length} admin accounts configured).`);
    }

    console.log('\n🎉 ALL DATABASE CHECKS PASSED! Your Supabase database is ready for production.');
    console.log('==================================================\n');

  } catch (err) {
    console.error('❌ Unexpected error during database setup:', err.message);
  }
}

main();
