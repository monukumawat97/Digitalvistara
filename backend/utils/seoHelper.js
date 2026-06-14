const db = require('../config/db');

/**
 * Generates an SEO HTML block to insert in `<head>`
 * @param {object} meta - Metadata containing title, desc, keywords, ogImage, canonicalUrl, schema
 */
function generateSEOBlock(meta) {
  const title = meta.title || 'Digital Vistara | Premium Digital Growth Agency';
  const description = meta.description || 'Digital Vistara is a premium digital growth agency providing technology, strategy, marketing, branding, and automation systems.';
  const keywords = meta.keywords || 'digital marketing, branding, web development, SEO, automation';
  const ogImage = meta.image ? (meta.image.startsWith('http') ? meta.image : `https://digitalvistara.in${meta.image}`) : 'https://digitalvistara.in/assets/images/logo.png';
  const url = meta.url || 'https://digitalvistara.in/';
  const type = meta.type || 'website';

  let seoHTML = `
    <!-- Dynamic SEO System by Antigravity -->
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="${url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${ogImage}">
  `;

  // Inject JSON-LD Schema Markup
  if (meta.schema) {
    seoHTML += `
    <script type="application/ld+json">
      ${JSON.stringify(meta.schema, null, 2)}
    </script>
    `;
  } else {
    // Fallback Organization Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Digital Vistara",
      "url": "https://digitalvistara.in",
      "logo": "https://digitalvistara.in/assets/images/logo.png",
      "sameAs": [
        "https://linkedin.com/company/digitalvistara",
        "https://instagram.com/digitalvistara"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9772566884",
        "contactType": "customer service",
        "email": "digitalvistara.in@gmail.com"
      }
    };
    seoHTML += `
    <script type="application/ld+json">
      ${JSON.stringify(orgSchema, null, 2)}
    </script>
    `;
  }

  return seoHTML;
}

/**
 * Injects dynamic SEO tags into HTML string, replacing existing meta blocks or inserting near top of <head>
 * @param {string} htmlString - Source html content of page
 * @param {object} metaData - Page specific metadata
 */
function injectSEO(htmlString, metaData) {
  const seoHTML = generateSEOBlock(metaData);
  
  // Replace standard titles and tags if present in the target HTML file, or insert in head
  let modifiedHTML = htmlString;
  
  // Simple check to remove default title/meta description tags to avoid duplicate tags in head
  modifiedHTML = modifiedHTML.replace(/<title>[\s\S]*?<\/title>/gi, '');
  modifiedHTML = modifiedHTML.replace(/<meta name="description"[\s\S]*?>/gi, '');
  modifiedHTML = modifiedHTML.replace(/<meta name="keywords"[\s\S]*?>/gi, '');

  // Insert the compiled SEO block right after the opening <head> tag
  modifiedHTML = modifiedHTML.replace('<head>', `<head>\n  ${seoHTML}`);

  return modifiedHTML;
}

/**
 * Express middleware to track page views and save simple analytics data
 */
async function trackerMiddleware(req, res, next) {
  // Ignore static assets and API requests
  const path = req.path;
  if (path.startsWith('/api') || path.startsWith('/uploads') || path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    return next();
  }

  // Run in background
  try {
    const referrer = req.headers.referer || '';
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.headers['x-forwarded-for'] || '';
    const sessionId = req.cookies ? req.cookies.session_id : '';

    db.query(
      'INSERT INTO analytics (event_type, path, referrer, user_agent, ip_address, session_id) VALUES ($1, $2, $3, $4, $5, $6)',
      ['pageview', path, referrer, userAgent, ip, sessionId]
    ).catch(e => console.error('Analytics track error:', e.message));

  } catch (err) {
    console.error('Analytics tracking failed:', err.message);
  }

  next();
}

module.exports = {
  injectSEO,
  trackerMiddleware
};
