const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.submitInquiry);
router.get('/', contactController.getAllInquiries);
router.patch('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.deleteInquiry);

module.exports = router;
