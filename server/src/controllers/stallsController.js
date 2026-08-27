const { supabase, isMock, mockStore } = require('../config/supabase');
const { sendReviewNotification } = require('../services/emailService');

// Public: Get all stalls for the public directory & showcase
exports.getAllStalls = async (req, res) => {
  try {
    if (isMock) {
      // Sort by stall number
      const stalls = [...mockStore.stalls].sort((a, b) => 
        (parseInt(a.stall_number, 10) || 0) - (parseInt(b.stall_number, 10) || 0)
      );
      return res.json({ success: true, stalls });
    }

    const { data: rawStalls, error } = await supabase
      .from('stalls')
      .select('*');

    if (error) throw error;
    
    // Sort numerically 1 to 30
    const stalls = (rawStalls || []).sort(
      (a, b) => (parseInt(a.stall_number, 10) || 0) - (parseInt(b.stall_number, 10) || 0)
    );
    res.json({ success: true, stalls });
  } catch (err) {
    console.error('Error fetching stalls:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve stalls.' });
  }
};

// Public: Get single stall by ID or stall number (e.g. /api/stalls/01 or /api/stalls/stall_01)
exports.getStallByIdOrNumber = async (req, res) => {
  try {
    const { idOrNumber } = req.params;
    if (!idOrNumber) {
      return res.status(400).json({ success: false, message: 'Stall identifier is required.' });
    }

    const cleanParam = idOrNumber.trim();
    const numOnly = cleanParam.replace(/\D/g, '');
    const cleanPadded = numOnly ? numOnly.padStart(2, '0') : cleanParam.padStart(2, '0');
    const cleanUnpadded = numOnly ? String(parseInt(numOnly, 10)) : cleanParam;

    if (isMock) {
      const stall = mockStore.stalls.find(
        (s) =>
          s.id === cleanParam ||
          s.id === `stall_${cleanParam}` ||
          s.id === `stall_${cleanPadded}` ||
          s.stall_number === cleanParam ||
          s.stall_number === cleanPadded ||
          s.stall_number === cleanUnpadded ||
          (parseInt(s.stall_number, 10) === parseInt(cleanParam, 10) && !isNaN(parseInt(cleanParam, 10)))
      );

      if (!stall) {
        return res.status(404).json({ success: false, message: `Stall '${idOrNumber}' not found.` });
      }

      return res.json({ success: true, stall });
    }

    // Live Supabase lookup
    const { data: stall, error } = await supabase
      .from('stalls')
      .select('*')
      .or(`id.eq.${cleanParam},stall_number.eq.${cleanParam},stall_number.eq.${cleanPadded},stall_number.eq.${cleanUnpadded}`)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!stall) {
      return res.status(404).json({ success: false, message: `Stall '${idOrNumber}' not found.` });
    }

    res.json({ success: true, stall });
  } catch (err) {
    console.error('Error fetching single stall:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve stall details.' });
  }
};

const voteRateLimitStore = new Map();

// Public: Submit a 1-5 Star Rating & Review for a specific stall
exports.submitReview = async (req, res) => {
  try {
    const { stall_id, rating, reviewer_name, reviewer_contact, review_text, client_token } = req.body;

    if (!stall_id) {
      return res.status(400).json({ success: false, message: 'Stall ID is required.' });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    // Security & Anti-Spam: Prevent duplicate votes for the same stall from same device/IP
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const voteKey = `${client_token || clientIp}_${stall_id}`;

    if (voteRateLimitStore.has(voteKey)) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted your official rating for this stall.',
      });
    }

    let matchedStall = null;
    const cleanId = String(stall_id).trim();
    const cleanPadded = cleanId.padStart(2, '0');

    if (isMock) {
      matchedStall = mockStore.stalls.find(
        (s) =>
          s.id === cleanId ||
          s.id === `stall_${cleanId}` ||
          s.id === `stall_${cleanPadded}` ||
          s.stall_number === cleanId ||
          s.stall_number === cleanPadded ||
          (parseInt(s.stall_number, 10) === parseInt(cleanId, 10) && !isNaN(parseInt(cleanId, 10)))
      );

      if (!matchedStall) {
        return res.status(404).json({ success: false, message: 'Specified stall was not found.' });
      }

      const stallName = matchedStall.name;
      const stallNumber = matchedStall.stall_number;
      const actualStallId = matchedStall.id;

      const newReview = {
        id: 'rev_' + Date.now(),
        stall_id: actualStallId,
        stall_name: stallName,
        stall_number: stallNumber,
        rating: parsedRating,
        reviewer_name: (reviewer_name || 'Anonymous Visitor').trim(),
        reviewer_contact: (reviewer_contact || '').trim(),
        review_text: (review_text || '').trim(),
        created_at: new Date().toISOString(),
      };

      voteRateLimitStore.set(voteKey, Date.now());
      mockStore.stall_reviews.unshift(newReview);

      // Trigger email dispatch to coordinator
      sendReviewNotification({
        stallName,
        stallNumber,
        rating: parsedRating,
        reviewerName: newReview.reviewer_name,
        reviewerContact: newReview.reviewer_contact,
        reviewText: newReview.review_text,
      });

      return res.status(201).json({
        success: true,
        message: `Thank you for rating Stall #${stallNumber} (${stallName})! Your rating of ${parsedRating}★ has been successfully recorded.`,
      });
    }

    // Live Supabase
    const { data: stall } = await supabase
      .from('stalls')
      .select('id, name, stall_number')
      .or(`id.eq.${cleanId},stall_number.eq.${cleanId},stall_number.eq.${cleanPadded}`)
      .limit(1)
      .maybeSingle();

    if (!stall) {
      return res.status(404).json({ success: false, message: 'Specified stall was not found.' });
    }

    const stallName = stall.name;
    const stallNumber = stall.stall_number;
    const actualStallId = stall.id;

    const newReview = {
      stall_id: actualStallId,
      rating: parsedRating,
      reviewer_name: (reviewer_name || 'Visitor').trim(),
      reviewer_contact: (reviewer_contact || '').trim(),
      review_text: (review_text || '').trim(),
    };

    const { error } = await supabase.from('stall_reviews').insert([newReview]);
    if (error) {
      console.error('Supabase review insert error:', error);
      throw error;
    }

    voteRateLimitStore.set(voteKey, Date.now());

    // Send email notification
    sendReviewNotification({
      stallName,
      stallNumber,
      rating: parsedRating,
      reviewerName: newReview.reviewer_name,
      reviewerContact: newReview.reviewer_contact,
      reviewText: newReview.review_text,
    });

    res.status(201).json({
      success: true,
      message: `Thank you for rating Stall #${stallNumber} (${stallName})! Your rating of ${parsedRating}★ has been successfully recorded.`,
    });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ success: false, message: 'Failed to submit rating. Please try again.' });
  }
};

// Admin: Get Leaderboard & Rankings (for committee to pick winner)
exports.getLeaderboard = async (req, res) => {
  try {
    let stalls = [];
    let reviews = [];

    if (isMock) {
      stalls = mockStore.stalls;
      reviews = mockStore.stall_reviews;
    } else {
      const [stallsRes, reviewsRes] = await Promise.all([
        supabase.from('stalls').select('*'),
        supabase.from('stall_reviews').select('*'),
      ]);
      stalls = stallsRes.data || [];
      reviews = reviewsRes.data || [];
    }

    // Compute stats per stall
    const leaderboard = stalls.map((stall) => {
      const stallReviews = reviews.filter((r) => r.stall_id === stall.id || r.stall_number === stall.stall_number);
      const totalRatings = stallReviews.length;
      const avgRating =
        totalRatings > 0
          ? (stallReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(2)
          : '0.00';

      return {
        ...stall,
        total_reviews: totalRatings,
        avg_rating: parseFloat(avgRating),
        rating_breakdown: {
          5: stallReviews.filter((r) => r.rating === 5).length,
          4: stallReviews.filter((r) => r.rating === 4).length,
          3: stallReviews.filter((r) => r.rating === 3).length,
          2: stallReviews.filter((r) => r.rating === 2).length,
          1: stallReviews.filter((r) => r.rating === 1).length,
        },
      };
    });

    // Sort by highest average rating, then total reviews, then stall number
    leaderboard.sort((a, b) => b.avg_rating - a.avg_rating || b.total_reviews - a.total_reviews || parseInt(a.stall_number, 10) - parseInt(b.stall_number, 10));

    res.json({
      success: true,
      total_stalls: stalls.length,
      total_votes: reviews.length,
      leaderboard,
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ success: false, message: 'Failed to compute leaderboard.' });
  }
};

// Admin: Get all reviews feed
exports.getAllReviews = async (req, res) => {
  try {
    if (isMock) {
      return res.json({ success: true, reviews: mockStore.stall_reviews });
    }

    const { data: reviews, error } = await supabase
      .from('stall_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
};

// Admin: Reset / Delete all reviews and ratings to start fresh
exports.resetReviews = async (req, res) => {
  try {
    voteRateLimitStore.clear();

    if (isMock) {
      mockStore.stall_reviews = [];
      return res.json({ success: true, message: 'All stall ratings and reviews have been completely reset.' });
    }

    // Delete all existing records in Supabase stall_reviews
    const { error } = await supabase
      .from('stall_reviews')
      .delete()
      .gte('rating', 0);

    if (error) {
      console.error('Error resetting Supabase reviews:', error);
      throw error;
    }

    mockStore.stall_reviews = [];

    res.json({ success: true, message: 'All stall ratings and reviews have been completely reset.' });
  } catch (err) {
    console.error('Error resetting reviews:', err);
    res.status(500).json({ success: false, message: 'Failed to reset reviews.' });
  }
};

// Admin: Create / Add a Stall
exports.createStall = async (req, res) => {
  try {
    const { stall_number, name, category, founders, department, description, instagram, image_url } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Stall name and category are required.' });
    }

    const paddedNum = (stall_number || '').trim().padStart(2, '0');

    const newStall = {
      stall_number: paddedNum,
      name: name.trim(),
      category: category.trim(),
      founders: (founders || '').trim(),
      department: (department || '').trim(),
      description: (description || '').trim(),
      instagram: (instagram || '').trim(),
      image_url: image_url || '/assets/hero/hero1.png',
      created_at: new Date().toISOString(),
    };

    if (isMock) {
      newStall.id = 'stall_' + paddedNum;
      mockStore.stalls.push(newStall);
      return res.status(201).json({ success: true, message: 'Stall added successfully.', stall: newStall });
    }

    const { data, error } = await supabase.from('stalls').insert([newStall]).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, message: 'Stall added successfully.', stall: data });
  } catch (err) {
    console.error('Error creating stall:', err);
    res.status(500).json({ success: false, message: 'Failed to create stall.' });
  }
};

// Admin: Update / Edit a Stall
exports.updateStall = async (req, res) => {
  try {
    const { id } = req.params;
    const { stall_number, name, category, founders, department, description, instagram, email, contact, image_url } = req.body;

    const cleanId = String(id).trim();

    if (isMock) {
      const idx = mockStore.stalls.findIndex((s) => s.id === cleanId || s.stall_number === cleanId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Stall not found.' });
      }
      mockStore.stalls[idx] = {
        ...mockStore.stalls[idx],
        ...(stall_number !== undefined ? { stall_number: String(stall_number).trim().padStart(2, '0') } : {}),
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(category !== undefined ? { category: category.trim() } : {}),
        ...(founders !== undefined ? { founders: founders.trim() } : {}),
        ...(department !== undefined ? { department: department.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(instagram !== undefined ? { instagram: instagram.trim() } : {}),
        ...(email !== undefined ? { email: email.trim() } : {}),
        ...(contact !== undefined ? { contact: contact.trim() } : {}),
        ...(image_url !== undefined ? { image_url: image_url.trim() } : {}),
      };
      return res.json({ success: true, message: 'Stall updated successfully.', stall: mockStore.stalls[idx] });
    }

    const updatePayload = {};
    if (stall_number !== undefined) updatePayload.stall_number = String(stall_number).trim().padStart(2, '0');
    if (name !== undefined) updatePayload.name = name.trim();
    if (category !== undefined) updatePayload.category = category.trim();
    if (founders !== undefined) updatePayload.founders = founders.trim();
    if (department !== undefined) updatePayload.department = department.trim();
    if (description !== undefined) updatePayload.description = description.trim();
    if (instagram !== undefined) updatePayload.instagram = instagram.trim();
    if (email !== undefined) updatePayload.email = email.trim();
    if (contact !== undefined) updatePayload.contact = contact.trim();
    if (image_url !== undefined) updatePayload.image_url = image_url.trim();

    const { data, error } = await supabase
      .from('stalls')
      .update(updatePayload)
      .eq('id', cleanId)
      .select()
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, message: 'Stall updated successfully.', stall: data });
  } catch (err) {
    console.error('Error updating stall:', err);
    res.status(500).json({ success: false, message: 'Failed to update stall.' });
  }
};

// Admin: Delete a Stall
exports.deleteStall = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock) {
      const idx = mockStore.stalls.findIndex((s) => s.id === id || s.stall_number === id);
      if (idx !== -1) {
        mockStore.stalls.splice(idx, 1);
        return res.json({ success: true, message: 'Stall deleted successfully.' });
      }
      return res.status(404).json({ success: false, message: 'Stall not found.' });
    }

    const { error } = await supabase.from('stalls').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Stall deleted successfully.' });
  } catch (err) {
    console.error('Error deleting stall:', err);
    res.status(500).json({ success: false, message: 'Failed to delete stall.' });
  }
};
