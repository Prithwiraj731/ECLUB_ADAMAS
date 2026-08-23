const { supabase, isMock, mockStore } = require('../config/supabase');
const { sendReviewNotification } = require('../services/emailService');

// Public: Get all stalls for the single rating page
exports.getAllStalls = async (req, res) => {
  try {
    if (isMock) {
      // Sort by stall number
      const stalls = [...mockStore.stalls].sort((a, b) => 
        (parseInt(a.stall_number) || 0) - (parseInt(b.stall_number) || 0)
      );
      return res.json({ success: true, stalls });
    }

    const { data: stalls, error } = await supabase
      .from('stalls')
      .select('*')
      .order('stall_number', { ascending: true });

    if (error) throw error;
    res.json({ success: true, stalls });
  } catch (err) {
    console.error('Error fetching stalls:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve stalls.' });
  }
};

// Public: Submit a 1-5 Star Rating & Review for a stall
exports.submitReview = async (req, res) => {
  try {
    const { stall_id, rating, reviewer_name, reviewer_contact, review_text } = req.body;

    if (!stall_id) {
      return res.status(400).json({ success: false, message: 'Stall ID is required.' });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    let stallName = 'Unknown Stall';
    let stallNumber = '';

    if (isMock) {
      const stall = mockStore.stalls.find((s) => s.id === stall_id);
      if (!stall) {
        return res.status(404).json({ success: false, message: 'Stall not found.' });
      }
      stallName = stall.name;
      stallNumber = stall.stall_number;

      const newReview = {
        id: 'rev_' + Date.now(),
        stall_id,
        stall_name: stallName,
        stall_number: stallNumber,
        rating: parsedRating,
        reviewer_name: (reviewer_name || 'Anonymous Visitor').trim(),
        reviewer_contact: (reviewer_contact || '').trim(),
        review_text: (review_text || '').trim(),
        created_at: new Date().toISOString(),
      };

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
        message: `Thank you for rating ${stallName}! Your feedback has been recorded for the evaluation committee.`,
      });
    }

    // Live Supabase
    const { data: stall } = await supabase.from('stalls').select('name, stall_number').eq('id', stall_id).single();
    if (stall) {
      stallName = stall.name;
      stallNumber = stall.stall_number;
    }

    const newReview = {
      stall_id,
      stall_name: stallName,
      stall_number: stallNumber,
      rating: parsedRating,
      reviewer_name: (reviewer_name || 'Anonymous Visitor').trim(),
      reviewer_contact: (reviewer_contact || '').trim(),
      review_text: (review_text || '').trim(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('stall_reviews').insert([newReview]);
    if (error) throw error;

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
      message: `Thank you for rating ${stallName}! Your feedback has been recorded for the evaluation committee.`,
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
      const stallReviews = reviews.filter((r) => r.stall_id === stall.id);
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

    // Sort by highest average rating, then total reviews
    leaderboard.sort((a, b) => b.avg_rating - a.avg_rating || b.total_reviews - a.total_reviews);

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

// Admin: Create / Add a Stall
exports.createStall = async (req, res) => {
  try {
    const { stall_number, name, category, founders, description, image_url } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Stall name and category are required.' });
    }

    const newStall = {
      stall_number: (stall_number || '').trim(),
      name: name.trim(),
      category: category.trim(),
      founders: (founders || '').trim(),
      description: (description || '').trim(),
      image_url: image_url || '/assets/hero/hero1.png',
      created_at: new Date().toISOString(),
    };

    if (isMock) {
      newStall.id = 'stall_' + Date.now();
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

// Admin: Delete a Stall
exports.deleteStall = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMock) {
      const idx = mockStore.stalls.findIndex((s) => s.id === id);
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
