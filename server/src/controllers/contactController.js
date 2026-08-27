const { supabase, isMock, mockStore } = require('../config/supabase');
const { sendContactInquiryNotification } = require('../services/emailService');

// Submit contact inquiry from website
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = (subject || 'General Inquiry').trim();
    const trimmedMessage = message.trim();

    const newInquiry = {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      created_at: new Date().toISOString()
    };

    // Forward email notification to adamaseclub@gmail.com asynchronously
    sendContactInquiryNotification({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage
    }).catch(err => console.error('Background email notification error:', err));

    if (isMock) {
      newInquiry.id = 'inq_' + Date.now();
      mockStore.contacts.unshift({ ...newInquiry, is_read: false });
      return res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Your message has been sent to the E-Club team.',
        inquiry: newInquiry
      });
    }

    // Attempt insert into inquiries table (or fallback to contacts table if existed)
    let savedData = null;
    const { data: inqData, error: inqErr } = await supabase
      .from('inquiries')
      .insert([newInquiry])
      .select()
      .maybeSingle();

    if (!inqErr && inqData) {
      savedData = inqData;
    } else {
      // Fallback try contacts table
      const { data: contData, error: contErr } = await supabase
        .from('contacts')
        .insert([newInquiry])
        .select()
        .maybeSingle();
        
      if (contErr && inqErr) {
        console.warn('⚠️ Supabase inquiry insert warning:', inqErr.message || contErr.message);
      } else {
        savedData = contData;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent to the E-Club team.',
      inquiry: savedData || newInquiry
    });
  } catch (err) {
    console.error('Error submitting contact inquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to submit message. Please try again.' });
  }
};


// Admin: Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    if (isMock) {
      return res.json({ success: true, inquiries: mockStore.contacts });
    }

    const { data: inquiries, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, inquiries });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve inquiries.' });
  }
};

// Admin: Mark inquiry as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock) {
      const inq = mockStore.contacts.find((c) => c.id === id);
      if (inq) {
        inq.is_read = true;
        return res.json({ success: true, message: 'Marked as read.' });
      }
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    const { error } = await supabase.from('contacts').update({ is_read: true }).eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    console.error('Error marking inquiry as read:', err);
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

// Admin: Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock) {
      const idx = mockStore.contacts.findIndex((c) => c.id === id);
      if (idx !== -1) {
        mockStore.contacts.splice(idx, 1);
        return res.json({ success: true, message: 'Inquiry deleted successfully.' });
      }
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
  }
};
