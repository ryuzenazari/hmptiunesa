const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get organization profile - public
router.get('/', organizationController.getOrganization);

// Update organization - admin only
router.put('/', authMiddleware, adminMiddleware, organizationController.updateOrganization);

// Department routes
router.post('/departments', authMiddleware, adminMiddleware, organizationController.addDepartment);
router.put('/departments/:id', authMiddleware, adminMiddleware, organizationController.updateDepartment);
router.delete('/departments/:id', authMiddleware, adminMiddleware, organizationController.deleteDepartment);

module.exports = router; 