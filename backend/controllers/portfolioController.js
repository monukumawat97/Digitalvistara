const db = require('../config/db');

function emitUpdate(req, action, data) {
  const io = req.app.get('socketio');
  if (io) {
    io.emit('portfolio_update', { action, data });
  }
}

/**
 * Get active portfolio projects (with category names joined)
 */
async function getPortfolios(req, res) {
  try {
    const queryStr = `
      SELECT p.*, pc.name as category_name, pc.slug as category_slug 
      FROM portfolio p 
      LEFT JOIN portfolio_categories pc ON p.category_id = pc.id 
      ORDER BY p.sort_order ASC, p.created_at DESC
    `;
    const result = await db.query(queryStr);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Portfolios Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve portfolio items' });
  }
}

/**
 * Get portfolio categories
 */
async function getCategories(req, res) {
  try {
    const result = await db.query('SELECT * FROM portfolio_categories ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get Portfolio Categories Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
  }
}

/**
 * Create portfolio project
 */
async function createPortfolio(req, res) {
  const { title, description, category_id, project_url, sort_order } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is a required field.' });
  }

  try {
    const catId = category_id ? parseInt(category_id, 10) : null;
    const order = sort_order ? parseInt(sort_order, 10) : 0;

    const result = await db.query(
      'INSERT INTO portfolio (title, description, category_id, image, project_url, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
      [title, description || null, catId, image, project_url || null, order]
    );

    let newProject = { title, description, category_id: catId, image, project_url, sort_order: order };
    if (db.dbType === 'sqlite' && result.insertId) {
      newProject.id = result.insertId;
    }

    // Get category info
    if (catId) {
      const catRes = await db.query('SELECT name, slug FROM portfolio_categories WHERE id = $1', [catId]);
      if (catRes.rows.length > 0) {
        newProject.category_name = catRes.rows[0].name;
        newProject.category_slug = catRes.rows[0].slug;
      }
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'create_portfolio', `Created portfolio item: ${title}`]
    );

    emitUpdate(req, 'create', newProject);

    res.status(201).json({ success: true, message: 'Portfolio item created.', data: newProject });
  } catch (error) {
    console.error('Create Portfolio Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create portfolio item.' });
  }
}

/**
 * Update portfolio project
 */
async function updatePortfolio(req, res) {
  const { id } = req.params;
  const { title, description, category_id, project_url, sort_order } = req.body;

  try {
    const projectRes = await db.query('SELECT * FROM portfolio WHERE id = $1', [id]);
    if (projectRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    }

    const current = projectRes.rows[0];
    const image = req.file ? `/uploads/${req.file.filename}` : current.image;
    const catId = category_id !== undefined ? (category_id ? parseInt(category_id, 10) : null) : current.category_id;
    const order = sort_order !== undefined ? parseInt(sort_order, 10) : current.sort_order;

    await db.query(
      'UPDATE portfolio SET title = $1, description = $2, category_id = $3, image = $4, project_url = $5, sort_order = $6 WHERE id = $7',
      [
        title || current.title,
        description !== undefined ? description : current.description,
        catId,
        image,
        project_url !== undefined ? project_url : current.project_url,
        order,
        id
      ]
    );

    const updated = {
      id: parseInt(id, 10),
      title: title || current.title,
      description: description !== undefined ? description : current.description,
      category_id: catId,
      image,
      project_url: project_url !== undefined ? project_url : current.project_url,
      sort_order: order
    };

    if (catId) {
      const catRes = await db.query('SELECT name, slug FROM portfolio_categories WHERE id = $1', [catId]);
      if (catRes.rows.length > 0) {
        updated.category_name = catRes.rows[0].name;
        updated.category_slug = catRes.rows[0].slug;
      }
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'update_portfolio', `Updated portfolio item: ${updated.title}`]
    );

    emitUpdate(req, 'update', updated);

    res.json({ success: true, message: 'Portfolio item updated.', data: updated });
  } catch (error) {
    console.error('Update Portfolio Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update portfolio item.' });
  }
}

/**
 * Delete portfolio project
 */
async function deletePortfolio(req, res) {
  const { id } = req.params;

  try {
    const projectRes = await db.query('SELECT * FROM portfolio WHERE id = $1', [id]);
    if (projectRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    }

    await db.query('DELETE FROM portfolio WHERE id = $1', [id]);

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'delete_portfolio', `Deleted portfolio item: ${projectRes.rows[0].title}`]
    );

    emitUpdate(req, 'delete', { id: parseInt(id, 10) });

    res.json({ success: true, message: 'Portfolio item deleted.' });
  } catch (error) {
    console.error('Delete Portfolio Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete portfolio item.' });
  }
}

/**
 * Create a new category
 */
async function createCategory(req, res) {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Category name and slug are required.' });
  }

  try {
    await db.query(
      'INSERT INTO portfolio_categories (name, slug) VALUES ($1, $2)',
      [name, slug.toLowerCase().trim()]
    );

    res.status(201).json({ success: true, message: 'Category created successfully.' });
  } catch (error) {
    console.error('Create Portfolio Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category (slug must be unique).' });
  }
}

/**
 * Delete a category
 */
async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM portfolio_categories WHERE id = $1', [id]);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete Portfolio Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
}

module.exports = {
  getPortfolios,
  getCategories,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  createCategory,
  deleteCategory
};
