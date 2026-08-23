const { supabase, isMock, mockStore } = require('../config/supabase');

// Get active notice for homepage banner
exports.getActiveNotice = async (req, res) => {
  try {
    if (isMock) {
      const active = mockStore.notices.find((n) => n.is_active) || null;
      return res.json({ success: true, notice: active });
    }

    const { data: notice, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, notice });
  } catch (err) {
    console.error('Error fetching active notice:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve active notice.' });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    if (isMock) {
      return res.json({ success: true, notices: mockStore.notices });
    }

    const { data: notices, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, notices });
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve notices.' });
  }
};

// Create notice
exports.createNotice = async (req, res) => {
  try {
    const { title, content, is_active, badge_text, link_url } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const newNotice = {
      title: title.trim(),
      content: content.trim(),
      is_active: !!is_active,
      badge_text: badge_text || 'IMPORTANT NOTICE',
      link_url: link_url ? link_url.trim() : '',
      created_at: new Date().toISOString()
    };

    if (isMock) {
      newNotice.id = 'not_' + Date.now();
      if (newNotice.is_active) {
        mockStore.notices.forEach((n) => (n.is_active = false));
      }
      mockStore.notices.unshift(newNotice);
      return res.status(201).json({ success: true, message: 'Notice created successfully.', notice: newNotice });
    }

    if (newNotice.is_active) {
      await supabase.from('notices').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data, error } = await supabase
      .from('notices')
      .insert([newNotice])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Notice created successfully.', notice: data });
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(500).json({ success: false, message: 'Failed to create notice.' });
  }
};

// Toggle or update notice active status
exports.toggleNoticeActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (isMock) {
      if (is_active) {
        mockStore.notices.forEach((n) => (n.is_active = false));
      }
      const notice = mockStore.notices.find((n) => n.id === id);
      if (!notice) {
        return res.status(404).json({ success: false, message: 'Notice not found.' });
      }
      notice.is_active = !!is_active;
      return res.json({ success: true, message: 'Notice updated successfully.', notice });
    }

    if (is_active) {
      await supabase.from('notices').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data, error } = await supabase
      .from('notices')
      .update({ is_active: !!is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Notice updated successfully.', notice: data });
  } catch (err) {
    console.error('Error updating notice:', err);
    res.status(500).json({ success: false, message: 'Failed to update notice.' });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock) {
      const idx = mockStore.notices.findIndex((n) => n.id === id);
      if (idx !== -1) {
        mockStore.notices.splice(idx, 1);
        return res.json({ success: true, message: 'Notice deleted successfully.' });
      }
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Notice deleted successfully.' });
  } catch (err) {
    console.error('Error deleting notice:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notice.' });
  }
};
