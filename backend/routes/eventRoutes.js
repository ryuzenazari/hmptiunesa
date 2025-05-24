const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getEvents);
router.get('/categories', eventController.getEventCategories);
router.get('/stats', eventController.getEventStats);
router.get('/:id', eventController.getEventById);

// Protected routes
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

module.exports = router; 