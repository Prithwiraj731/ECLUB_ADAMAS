const { supabase } = require('../config/supabase');

async function syncLiveDb() {
  try {
    console.log('Syncing live Supabase database with Launch Pad event...');
    
    // 1. Check existing launchpad events
    const { data: existing, error: findError } = await supabase
      .from('events')
      .select('*')
      .ilike('title', '%LAUNCH PAD%');

    if (findError) throw findError;

    if (!existing || existing.length === 0) {
      // Unfeature other events
      await supabase.from('events').update({ is_featured: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new featured event
      const { data: ins, error: insError } = await supabase.from('events').insert([
        {
          title: 'INTER-SCHOOL START UP LAUNCH PAD',
          description: 'The Adamas University Entrepreneurship Club presents the Inter-School Start Up Launch Pad! Teams from all 10 Adamas schools compete across 3 high-stakes simulation rounds: Discover & Strategise, Build & Execute, and Crisis & Adapt. “It’s not just about having the best idea, but making the best decisions.”',
          date: 'Wednesday, September 16, 2026 • 2:00 PM – 5:00 PM',
          location: 'AU International Lounge, Adamas University',
          image_url: '/assets/startup-launchpad.jpg',
          is_featured: true,
          registration_link: '/launchpad'
        }
      ]).select();

      if (insError) throw insError;
      console.log('✅ Successfully inserted featured Launch Pad event:', ins[0]?.title);
    } else {
      const eventId = existing[0].id;
      // Unfeature other events
      await supabase.from('events').update({ is_featured: false }).neq('id', eventId);
      
      // Update this event
      await supabase.from('events').update({
        title: 'INTER-SCHOOL START UP LAUNCH PAD',
        description: 'The Adamas University Entrepreneurship Club presents the Inter-School Start Up Launch Pad! Teams from all 10 Adamas schools compete across 3 high-stakes simulation rounds: Discover & Strategise, Build & Execute, and Crisis & Adapt. “It’s not just about having the best idea, but making the best decisions.”',
        date: 'Wednesday, September 16, 2026 • 2:00 PM – 5:00 PM',
        location: 'AU International Lounge, Adamas University',
        image_url: '/assets/startup-launchpad.jpg',
        is_featured: true,
        registration_link: '/launchpad'
      }).eq('id', eventId);

      console.log('✅ Successfully updated Launch Pad event to featured');
    }

    // 2. Update notice
    const { error: noticeError } = await supabase
      .from('notices')
      .update({
        link_url: '/launchpad',
        badge_text: 'MANDATORY BRIEFING',
        content: 'A crucial briefing session for all 10 participating school teams will be held on Tuesday evening, 15 September 2026. The main competition will take place on Wednesday, 16 September 2026, 2:00 PM – 5:00 PM at AU International Lounge.'
      })
      .ilike('title', '%Launch Pad%');

    if (noticeError) throw noticeError;
    console.log('✅ Successfully updated active notice to link to /launchpad');

  } catch (err) {
    console.error('Error syncing Supabase database:', err);
  }
}

syncLiveDb();
