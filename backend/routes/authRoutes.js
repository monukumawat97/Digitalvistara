const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile, getDashboardStats } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

// Public route with strict login rate limiter
router.post('/login', loginLimiter, login);

// Protected routes (Requires valid JWT admin cookie or auth header)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
