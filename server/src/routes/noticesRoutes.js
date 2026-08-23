const express = require('express');
const router = express.Router();
const noticesController = require('../controllers/noticesController');

router.get('/', noticesController.getAllNotices);
router.get('/active', noticesController.getActiveNotice);
router.post('/', noticesController.createNotice);
router.patch('/:id', noticesController.toggleNoticeActive);
router.delete('/:id', noticesController.deleteNotice);

module.exports = router;
