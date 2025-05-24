const express = require('express');
const router = express.Router();
const functionaryController = require('../controllers/functionaryController');

// Routes GET
router.get('/', functionaryController.getAllFunctionaries);
router.get('/active', functionaryController.getActiveFunctionaries);
router.get('/period/:period', functionaryController.getFunctionariesByPeriod);
router.get('/department/:department', functionaryController.getFunctionariesByDepartment);
router.get('/:id', functionaryController.getFunctionaryById);

// Routes POST
router.post('/', functionaryController.createFunctionary);

// Routes PUT
router.put('/:id', functionaryController.updateFunctionary);

// Routes DELETE
router.delete('/:id', functionaryController.deleteFunctionary);

module.exports = router; 