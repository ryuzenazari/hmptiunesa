const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/me', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.put('/:id/role', authMiddleware, adminMiddleware, userController.updateUserRole);

module.exports = router; 