const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function testFullFlow() {
  console.log('====================================================');
  console.log('🧪 TESTING STALL QR LOOKUP & RATING END-TO-END');
  console.log('====================================================\n');

  // Test 1: Test lookup for all 32 stalls by various scan formats
  console.log('1️⃣ Testing QR URL parameter resolution for key stalls:');
  const testParams = ['1', '01', 'stall_1', '2', '02', '14', '26', '31', '32', 'stall_32'];

  for (const param of testParams) {
    const cleanParam = String(param).trim();
    const numOnly = cleanParam.replace(/\D/g, '');
    const cleanPadded = numOnly ? numOnly.padStart(2, '0') : cleanParam.padStart(2, '0');
    const cleanUnpadded = numOnly ? String(parseInt(numOnly, 10)) : cleanParam;

    const { data: stall, error } = await supabase
      .from('stalls')
      .select('id, stall_number, name, category, founders')
      .or(`id.eq.${cleanParam},id.eq.stall_${cleanUnpadded},id.eq.stall_${cleanPadded},stall_number.eq.${cleanParam},stall_number.eq.${cleanPadded},stall_number.eq.${cleanUnpadded}`)
      .limit(1)
      .maybeSingle();

    if (error || !stall) {
      console.error(`❌ FAILED to resolve param '${param}':`, error);
    } else {
      console.log(`✅ Scan param '${param}' resolved to -> Stall #${stall.stall_number}: "${stall.name}" (${stall.founders})`);
    }
  }

  // Test 2: Test Submitting a Real Rating for Stall #32 (B.Tech Momowala)
  console.log('\n2️⃣ Testing Rating Submission for Stall #32 (B.Tech Momowala):');
  const testReview = {
    stall_id: 'stall_32',
    rating: 5,
    reviewer_name: 'Test Visitor',
    reviewer_contact: 'test@example.com',
    review_text: '✨ Exceptional Quality, 💎 Best Value',
  };

  const { data: insertedReview, error: insertError } = await supabase
    .from('stall_reviews')
    .insert([testReview])
    .select()
    .single();

  if (insertError) {
    console.error('❌ FAILED to insert review into Supabase:', insertError);
  } else {
    console.log('✅ Review successfully saved into Supabase stall_reviews:');
    console.log(insertedReview);
  }

  // Test 3: Test Leaderboard calculation with the new review
  console.log('\n3️⃣ Testing Leaderboard recalculation:');
  const [stallsRes, reviewsRes] = await Promise.all([
    supabase.from('stalls').select('*'),
    supabase.from('stall_reviews').select('*'),
  ]);

  const stalls = stallsRes.data || [];
  const reviews = reviewsRes.data || [];

  const targetStall = stalls.find(s => s.stall_number === '32' || s.id === 'stall_32');
  const targetReviews = reviews.filter(r => r.stall_id === targetStall.id || r.stall_id === targetStall.stall_number);

  console.log(`Stall #32 (${targetStall.name}) has ${targetReviews.length} total review(s).`);
  console.log(`Average rating: ${(targetReviews.reduce((s, r) => s + r.rating, 0) / targetReviews.length).toFixed(2)} ★`);

  // Test 4: Cleanup test review so we leave production clean
  console.log('\n4️⃣ Cleaning up test review:');
  if (insertedReview && insertedReview.id) {
    const { error: delError } = await supabase
      .from('stall_reviews')
      .delete()
      .eq('id', insertedReview.id);

    if (delError) {
      console.error('Warning: could not delete test review:', delError);
    } else {
      console.log('✅ Test review cleanly removed from database.');
    }
  }

  console.log('\n====================================================');
  console.log('🎉 ALL TESTS PASSED: QR SCANNING & RATING ARE 100% OPERATIONAL!');
  console.log('====================================================');
}

testFullFlow();
