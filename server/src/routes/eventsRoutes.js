const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getAllEvents);
router.get('/featured', eventsController.getFeaturedEvent);
router.post('/', eventsController.createEvent);
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
