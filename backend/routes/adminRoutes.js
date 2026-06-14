const express = require('express');
const router = express.Router();

// Middlewares
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Controllers
const { getAllServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { createPortfolio, updatePortfolio, deletePortfolio, createCategory, deleteCategory } = require('../controllers/portfolioController');
const { getAllBlogs, createBlog, updateBlog, deleteBlog, createBlogCategory, deleteBlogCategory } = require('../controllers/blogController');
const { createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { getLeads, updateLead, exportLeadsCSV } = require('../controllers/leadController');
const { uploadFile, getMediaFiles, deleteMediaFile } = require('../controllers/mediaController');
const { updateSettings } = require('../controllers/settingsController');

// Secure all routes in this router with JWT protection
router.use(protect);

// Services CMS
router.get('/services', getAllServices);
router.post('/services', upload.single('image'), createService);
router.put('/services/:id', upload.single('image'), updateService);
router.delete('/services/:id', deleteService);

// Portfolio CMS
router.post('/portfolio', upload.single('image'), createPortfolio);
router.put('/portfolio/:id', upload.single('image'), updatePortfolio);
router.delete('/portfolio/:id', deletePortfolio);
router.post('/portfolio/categories', createCategory);
router.delete('/portfolio/categories/:id', deleteCategory);

// Blogs CMS
router.get('/blogs', getAllBlogs);
router.post('/blogs', upload.single('featured_image'), createBlog);
router.put('/blogs/:id', upload.single('featured_image'), updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.post('/blogs/categories', createBlogCategory);
router.delete('/blogs/categories/:id', deleteBlogCategory);

// Team CMS
router.post('/team', upload.single('photo'), createTeamMember);
router.put('/team/:id', upload.single('photo'), updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

// Testimonials CMS
router.post('/testimonials', upload.single('client_image'), createTestimonial);
router.put('/testimonials/:id', upload.single('client_image'), updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Lead Management
router.get('/leads', getLeads);
router.get('/leads/export', exportLeadsCSV);
router.put('/leads/:id', updateLead);

// Media Library CMS
router.get('/media', getMediaFiles);
router.post('/media', upload.single('file'), uploadFile);
router.delete('/media/:id', deleteMediaFile);

// System Settings CMS
router.put('/settings', updateSettings);

module.exports = router;
