const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const { apiLimiter, modifyLimiter } = require('../middleware/rateLimitMiddleware');

// Apply API rate limiter ke semua routes
router.use(apiLimiter);

// Routes GET (public)
router.get('/', projectController.getAllProjects);
router.get('/search', projectController.searchProjects);
router.get('/category/:category', projectController.getProjectsByCategory);
router.get('/status/:status', projectController.getProjectsByStatus);
router.get('/:id', projectController.getProjectById);

// Routes POST, PUT, DELETE (protected)
// Hanya admin dan pengurus yang bisa membuat, mengupdate, dan menghapus proyek
router.post(
  '/', 
  protect, 
  authorize('admin', 'pengurus'),
  modifyLimiter,
  uploadSingle('thumbnail'),
  handleUploadError,
  projectController.createProject
);

router.post(
  '/multiple-images/:id',
  protect, 
  authorize('admin', 'pengurus'),
  modifyLimiter,
  uploadMultiple('images', 10), // Maksimum 10 gambar
  handleUploadError,
  projectController.updateProject
);

router.put(
  '/:id', 
  protect, 
  authorize('admin', 'pengurus'),
  modifyLimiter,
  uploadSingle('thumbnail'),
  handleUploadError,
  projectController.updateProject
);

router.delete(
  '/:id', 
  protect, 
  authorize('admin'),
  modifyLimiter,
  projectController.deleteProject
);

module.exports = router; 