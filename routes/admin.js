const express = require('express');
const taskController = require('../controllers/taskController');
const { protect, adminOnly } = require('../middlewares/auth');

const router = express.Router();
router.use(protect, adminOnly);
router.get('/', taskController.adminDashboard);

module.exports = router;
