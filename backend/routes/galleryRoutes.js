const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', galleryController.getAllGalleryItems);
router.get('/featured', galleryController.getFeaturedItems);
router.get('/:id', galleryController.getGalleryItemById);

// Protected routes
router.post('/', authMiddleware, galleryController.createGalleryItem);
router.put('/:id', authMiddleware, galleryController.updateGalleryItem);
router.delete('/:id', authMiddleware, galleryController.deleteGalleryItem);

// Admin routes
router.put('/:id/featured', authMiddleware, adminMiddleware, galleryController.toggleFeatured);

module.exports = router; 