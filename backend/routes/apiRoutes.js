const express = require('express');
const router = express.Router();

// Controllers
const { getServices } = require('../controllers/serviceController');
const { getPortfolios, getCategories } = require('../controllers/portfolioController');
const { getBlogs, getBlogBySlug, getBlogCategories } = require('../controllers/blogController');
const { getTeamMembers } = require('../controllers/teamController');
const { getTestimonials } = require('../controllers/testimonialController');
const { createLead } = require('../controllers/leadController');
const { getSettings } = require('../controllers/settingsController');

// Rate Limiter middleware
const { leadLimiter } = require('../middleware/rateLimiter');

// Public Data Read APIs
router.get('/services', getServices);
router.get('/portfolio', getPortfolios);
router.get('/portfolio/categories', getCategories);
router.get('/blogs', getBlogs);
router.get('/blogs/categories', getBlogCategories);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/team', getTeamMembers);
router.get('/testimonials', getTestimonials);
router.get('/settings', getSettings);

// Public Lead Submission (secured by rate limiting)
router.post('/contact', leadLimiter, createLead);

module.exports = router;
