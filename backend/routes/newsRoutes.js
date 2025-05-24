const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.get('/category/:category', newsController.getNewsByCategory);

// Protected routes
router.post('/', authMiddleware, newsController.createNews);
router.put('/:id', authMiddleware, newsController.updateNews);
router.delete('/:id', authMiddleware, newsController.deleteNews);

module.exports = router; 