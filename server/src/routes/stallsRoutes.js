const express = require('express');
const router = express.Router();
const stallsController = require('../controllers/stallsController');

// Public routes for visitors
router.get('/', stallsController.getAllStalls);
router.post('/review', stallsController.submitReview);

// Admin routes for E-Club committee
router.get('/leaderboard', stallsController.getLeaderboard);
router.get('/reviews', stallsController.getAllReviews);
router.post('/', stallsController.createStall);
router.delete('/:id', stallsController.deleteStall);

module.exports = router;
