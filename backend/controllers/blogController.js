const db = require('../config/db');

function emitUpdate(req, action, data) {
  const io = req.app.get('socketio');
  if (io) {
    io.emit('blogs_update', { action, data });
  }
}

/**
 * Get published blogs for frontend website (supports search & category filters)
 */
async function getBlogs(req, res) {
  const { search, category } = req.query;
  
  try {
    let queryStr = `
      SELECT b.*, bc.name as category_name, bc.slug as category_slug 
      FROM blogs b 
      LEFT JOIN blog_categories bc ON b.category_id = bc.id 
      WHERE b.status = 'published'
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      queryStr += ` AND bc.slug = $${paramIndex++}`;
      params.push(category);
    }

    if (search) {
      queryStr += ` AND (b.title LIKE $${paramIndex} OR b.content LIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    queryStr += ' ORDER BY b.created_at DESC';

    const result = await db.query(queryStr, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Blogs Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve blogs' });
  }
}

/**
 * Fetch a single blog by slug (increments view count)
 */
async function getBlogBySlug(req, res) {
  const { slug } = req.params;

  try {
    const result = await db.query(
      `SELECT b.*, bc.name as category_name, bc.slug as category_slug 
       FROM blogs b 
       LEFT JOIN blog_categories bc ON b.category_id = bc.id 
       WHERE b.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    const blog = result.rows[0];

    // Increment views asynchronously
    db.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [blog.id]).catch(err => 
      console.error('Increment Blog Views Error:', err.message)
    );

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Get Blog By Slug Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve blog post.' });
  }
}

/**
 * Get all blogs (for admin dashboard including draft files)
 */
async function getAllBlogs(req, res) {
  try {
    const queryStr = `
      SELECT b.*, bc.name as category_name, bc.slug as category_slug 
      FROM blogs b 
      LEFT JOIN blog_categories bc ON b.category_id = bc.id 
      ORDER BY b.created_at DESC
    `;
    const result = await db.query(queryStr);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get All Blogs Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve blogs' });
  }
}

/**
 * Create blog post
 */
async function createBlog(req, res) {
  const { title, slug, content, summary, category_id, status, seo_title, seo_description, seo_keywords } = req.body;
  const featured_image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content || !slug) {
    return res.status(400).json({ success: false, message: 'Title, content, and slug are required fields.' });
  }

  try {
    const catId = category_id ? parseInt(category_id, 10) : null;
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').trim();

    // Check slug uniqueness
    const checkSlug = await db.query('SELECT id FROM blogs WHERE slug = $1', [cleanSlug]);
    if (checkSlug.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Slug already in use. Please modify url slug.' });
    }

    const result = await db.query(
      `INSERT INTO blogs (category_id, title, slug, content, summary, featured_image, status, seo_title, seo_description, seo_keywords) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        catId, 
        title, 
        cleanSlug, 
        content, 
        summary || null, 
        featured_image, 
        status || 'draft', 
        seo_title || title, 
        seo_description || summary || null, 
        seo_keywords || null
      ]
    );

    let newBlog = { 
      title, 
      slug: cleanSlug, 
      content, 
      summary, 
      category_id: catId, 
      featured_image, 
      status: status || 'draft',
      seo_title: seo_title || title,
      seo_description: seo_description || summary,
      seo_keywords,
      views: 0
    };

    if (db.dbType === 'sqlite' && result.insertId) {
      newBlog.id = result.insertId;
    }

    if (catId) {
      const catRes = await db.query('SELECT name, slug FROM blog_categories WHERE id = $1', [catId]);
      if (catRes.rows.length > 0) {
        newBlog.category_name = catRes.rows[0].name;
        newBlog.category_slug = catRes.rows[0].slug;
      }
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'create_blog', `Created blog: ${title}`]
    );

    // Emit socket event if published
    if (status === 'published') {
      emitUpdate(req, 'create', newBlog);
    }

    res.status(201).json({ success: true, message: 'Blog post created successfully.', data: newBlog });
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create blog post.' });
  }
}

/**
 * Update blog post
 */
async function updateBlog(req, res) {
  const { id } = req.params;
  const { title, slug, content, summary, category_id, status, seo_title, seo_description, seo_keywords } = req.body;

  try {
    const blogRes = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (blogRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    const current = blogRes.rows[0];
    const featured_image = req.file ? `/uploads/${req.file.filename}` : current.featured_image;
    const catId = category_id !== undefined ? (category_id ? parseInt(category_id, 10) : null) : current.category_id;
    
    let cleanSlug = current.slug;
    if (slug && slug !== current.slug) {
      cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').trim();
      const checkSlug = await db.query('SELECT id FROM blogs WHERE slug = $1 AND id != $2', [cleanSlug, id]);
      if (checkSlug.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Slug already in use.' });
      }
    }

    await db.query(
      `UPDATE blogs SET 
        category_id = $1, 
        title = $2, 
        slug = $3, 
        content = $4, 
        summary = $5, 
        featured_image = $6, 
        status = $7, 
        seo_title = $8, 
        seo_description = $9, 
        seo_keywords = $10 
       WHERE id = $11`,
      [
        catId,
        title || current.title,
        cleanSlug,
        content || current.content,
        summary !== undefined ? summary : current.summary,
        featured_image,
        status || current.status,
        seo_title !== undefined ? seo_title : current.seo_title,
        seo_description !== undefined ? seo_description : current.seo_description,
        seo_keywords !== undefined ? seo_keywords : current.seo_keywords,
        id
      ]
    );

    const updated = {
      id: parseInt(id, 10),
      title: title || current.title,
      slug: cleanSlug,
      content: content || current.content,
      summary: summary !== undefined ? summary : current.summary,
      category_id: catId,
      featured_image,
      status: status || current.status,
      seo_title: seo_title !== undefined ? seo_title : current.seo_title,
      seo_description: seo_description !== undefined ? seo_description : current.seo_description,
      seo_keywords: seo_keywords !== undefined ? seo_keywords : current.seo_keywords
    };

    if (catId) {
      const catRes = await db.query('SELECT name, slug FROM blog_categories WHERE id = $1', [catId]);
      if (catRes.rows.length > 0) {
        updated.category_name = catRes.rows[0].name;
        updated.category_slug = catRes.rows[0].slug;
      }
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'update_blog', `Updated blog: ${updated.title}`]
    );

    emitUpdate(req, 'update', updated);

    res.json({ success: true, message: 'Blog post updated successfully.', data: updated });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update blog post.' });
  }
}

/**
 * Delete blog post
 */
async function deleteBlog(req, res) {
  const { id } = req.params;

  try {
    const blogRes = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (blogRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    await db.query('DELETE FROM blogs WHERE id = $1', [id]);

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'delete_blog', `Deleted blog post: ${blogRes.rows[0].title}`]
    );

    emitUpdate(req, 'delete', { id: parseInt(id, 10) });

    res.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog post.' });
  }
}

/**
 * Get Blog Categories
 */
async function getBlogCategories(req, res) {
  try {
    const result = await db.query('SELECT * FROM blog_categories ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get Blog Categories Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
  }
}

/**
 * Create Blog Category
 */
async function createBlogCategory(req, res) {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Category name and slug are required.' });
  }

  try {
    await db.query(
      'INSERT INTO blog_categories (name, slug) VALUES ($1, $2)',
      [name, slug.toLowerCase().trim()]
    );

    res.status(201).json({ success: true, message: 'Blog category created successfully.' });
  } catch (error) {
    console.error('Create Blog Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category (slug must be unique).' });
  }
}

/**
 * Delete Blog Category
 */
async function deleteBlogCategory(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM blog_categories WHERE id = $1', [id]);
    res.json({ success: true, message: 'Blog category deleted successfully.' });
  } catch (error) {
    console.error('Delete Blog Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
}

module.exports = {
  getBlogs,
  getBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  createBlogCategory,
  deleteBlogCategory
};
