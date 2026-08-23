const { supabase, isMock, mockStore } = require('../config/supabase');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    if (isMock) {
      return res.json({ success: true, events: mockStore.events });
    }

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve events.' });
  }
};

// Get featured event
exports.getFeaturedEvent = async (req, res) => {
  try {
    if (isMock) {
      const featured = mockStore.events.find((e) => e.is_featured) || mockStore.events[0];
      return res.json({ success: true, event: featured });
    }

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, event });
  } catch (err) {
    console.error('Error fetching featured event:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve featured event.' });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, image_url, is_featured, registration_link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const newEvent = {
      title,
      description,
      date: date || '',
      location: location || '',
      image_url: image_url || '/assets/hero/hero1.png',
      is_featured: !!is_featured,
      registration_link: registration_link || '#contact',
      created_at: new Date().toISOString()
    };

    if (isMock) {
      newEvent.id = 'evt_' + Date.now();
      if (newEvent.is_featured) {
        mockStore.events.forEach((e) => (e.is_featured = false));
      }
      mockStore.events.unshift(newEvent);
      return res.status(201).json({ success: true, message: 'Event created successfully.', event: newEvent });
    }

    if (newEvent.is_featured) {
      await supabase.from('events').update({ is_featured: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Event created successfully.', event: data });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock) {
      const idx = mockStore.events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        mockStore.events.splice(idx, 1);
        return res.json({ success: true, message: 'Event deleted successfully.' });
      }
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};
