const express = require('express');
const router = express.Router();
const stallsController = require('../controllers/stallsController');

// Admin / Leaderboard & Reviews routes (declared first to avoid route parameter collision)
router.get('/leaderboard', stallsController.getLeaderboard);
router.get('/reviews', stallsController.getAllReviews);
router.post('/reset-reviews', stallsController.resetReviews);
router.delete('/reviews', stallsController.resetReviews);

// Public routes for visitors
router.get('/voting-status', stallsController.getVotingStatus);
router.post('/toggle-voting', stallsController.toggleVotingStatus);
router.get('/', stallsController.getAllStalls);
router.get('/:idOrNumber', stallsController.getStallByIdOrNumber);
router.post('/review', stallsController.submitReview);

// Admin stall management routes
router.post('/', stallsController.createStall);
router.put('/:id', stallsController.updateStall);
router.delete('/:id', stallsController.deleteStall);

module.exports = router;
