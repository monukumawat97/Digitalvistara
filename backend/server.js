const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Database manager and initializer
const db = require('./config/db');
const { initializeDatabase } = require('./models/databaseInit');

// Utility Middlewares
const { trackerMiddleware, injectSEO } = require('./utils/seoHelper');
const { apiLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Make Socket.io accessible within route controllers
app.set('socketio', io);

// Global Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for ease of Tailwind CDN & Google Fonts loading
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware (custom, lightweight)
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      req.cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  next();
});

// Analytics tracking visitor page hits
app.use(trackerMiddleware);

// Static Uploads Folder
const uploadsPath = path.resolve(__dirname, process.env.UPLOAD_PATH || './uploads');
app.use('/uploads', express.static(uploadsPath));

// REST API Endpoints
app.use('/api', apiLimiter); // Apply rate limiter to all API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// --- DYNAMIC SEO INTERCEPTOR FOR STATIC HTML FILES ---
// Intercept Single Blog detail page (Server-Side Injection)
app.get('/blog/:slug', async (req, res) => {
  const { slug } = req.params;
  const filePath = path.resolve(__dirname, '..', 'public', 'blog-detail.html');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Blog details template page not found.');
  }

  try {
    const blogRes = await db.query(
      `SELECT b.*, bc.name as category_name 
       FROM blogs b 
       LEFT JOIN blog_categories bc ON b.category_id = bc.id 
       WHERE b.slug = $1 AND b.status = 'published'`,
      [slug]
    );

    let htmlContent = fs.readFileSync(filePath, 'utf8');

    if (blogRes.rows.length === 0) {
      // Return details file with default 404 SEO metadata
      htmlContent = injectSEO(htmlContent, {
        title: 'Blog Not Found | Digital Vistara',
        description: 'The requested blog post could not be found.',
        url: `https://digitalvistara.in/blog/${slug}`
      });
      return res.status(404).send(htmlContent);
    }

    const blog = blogRes.rows[0];
    
    // Inject dynamic SEO meta tags based on database blog row
    htmlContent = injectSEO(htmlContent, {
      title: `${blog.seo_title || blog.title} | Digital Vistara Blog`,
      description: blog.seo_description || blog.summary || 'Read this post on Digital Vistara.',
      keywords: blog.seo_keywords || 'blog, growth agency',
      image: blog.featured_image,
      url: `https://digitalvistara.in/blog/${slug}`,
      type: 'article',
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": blog.featured_image ? `https://digitalvistara.in${blog.featured_image}` : 'https://digitalvistara.in/assets/images/logo.png',
        "author": {
          "@type": "Organization",
          "name": "Digital Vistara"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Digital Vistara",
          "logo": {
            "@type": "ImageObject",
            "url": "https://digitalvistara.in/assets/images/logo.png"
          }
        },
        "datePublished": blog.created_at,
        "description": blog.summary
      }
    });

    res.send(htmlContent);
  } catch (error) {
    console.error('SEO Blog Intercept Error:', error);
    res.sendFile(filePath);
  }
});

// Intercept standard frontend HTML files for general SEO tags injection
app.get([
  '/', 
  '/index.html', 
  '/about.html', 
  '/services.html', 
  '/portfolio.html', 
  '/blog.html', 
  '/contact.html'
], async (req, res) => {
  let reqPath = req.path;
  if (reqPath === '/' || reqPath === '/index.html') {
    reqPath = 'index.html';
  } else {
    reqPath = reqPath.replace(/^\//, '');
  }

  const filePath = path.resolve(__dirname, '..', 'public', reqPath);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Page not found.');
  }

  try {
    // Fetch global SEO configurations from website_settings database table
    const settingsRes = await db.query(
      "SELECT setting_key, setting_value FROM website_settings WHERE group_name = 'seo' OR setting_key = 'site_name'"
    );
    const settings = {};
    settingsRes.rows.forEach(r => { settings[r.setting_key] = r.setting_value; });

    let htmlContent = fs.readFileSync(filePath, 'utf8');

    // Compile page specific titles
    let pageTitle = settings.seo_meta_title || 'Digital Vistara | Digital Growth Agency';
    const pageName = reqPath.replace('.html', '');
    if (pageName !== 'index') {
      const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      pageTitle = `${capitalized} | ${settings.site_name || 'Digital Vistara'}`;
    }

    htmlContent = injectSEO(htmlContent, {
      title: pageTitle,
      description: settings.seo_meta_description,
      keywords: settings.seo_meta_keywords,
      url: `https://digitalvistara.in/${reqPath === 'index.html' ? '' : reqPath}`
    });

    res.send(htmlContent);
  } catch (err) {
    console.error('General SEO Intercept Error:', err);
    res.sendFile(filePath);
  }
});

// Serve admin panel statically (protected folder block is handled by front-end auth logic or cookies)
app.use('/admin', express.static(path.resolve(__dirname, '..', 'admin')));

// Serve other public assets statically
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// Fallback index.html route for SPA or root requests
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

// Socket.io Real-time connection management
io.on('connection', (socket) => {
  console.log(`Socket Connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

// Startup Server
const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    // 1. Initialize DB tables & seed records
    await initializeDatabase();

    // 2. Listen on port
    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 DIGITAL VISTARA PLATFORM LIVE AT: http://localhost:${PORT}`);
      console.log(`🔐 ADMIN DASHBOARD AVAILABLE AT: http://localhost:${PORT}/admin/login.html`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Critical Server Initialization Failure:', error);
    process.exit(1);
  }
}

startServer();
