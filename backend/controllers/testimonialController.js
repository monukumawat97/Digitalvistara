const db = require('../config/db');

function emitUpdate(req, action, data) {
  const io = req.app.get('socketio');
  if (io) {
    io.emit('testimonials_update', { action, data });
  }
}

/**
 * Get testimonials
 */
async function getTestimonials(req, res) {
  try {
    const result = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve testimonials' });
  }
}

/**
 * Create testimonial
 */
async function createTestimonial(req, res) {
  const { client_name, client_company, rating, review_text } = req.body;
  const client_image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!client_name || !review_text) {
    return res.status(400).json({ success: false, message: 'Client name and review content are required.' });
  }

  try {
    const score = rating ? parseInt(rating, 10) : 5;
    const result = await db.query(
      'INSERT INTO testimonials (client_name, client_company, client_image, rating, review_text) VALUES ($1, $2, $3, $4, $5)',
      [client_name, client_company || null, client_image, score, review_text]
    );

    let newTestimonial = { client_name, client_company, client_image, rating: score, review_text };
    if (db.dbType === 'sqlite' && result.insertId) {
      newTestimonial.id = result.insertId;
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'create_testimonial', `Created testimonial for client: ${client_name}`]
    );

    emitUpdate(req, 'create', newTestimonial);

    res.status(201).json({ success: true, message: 'Testimonial created successfully.', data: newTestimonial });
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create testimonial.' });
  }
}

/**
 * Update testimonial
 */
async function updateTestimonial(req, res) {
  const { id } = req.params;
  const { client_name, client_company, rating, review_text } = req.body;

  try {
    const testRes = await db.query('SELECT * FROM testimonials WHERE id = $1', [id]);
    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    const current = testRes.rows[0];
    const client_image = req.file ? `/uploads/${req.file.filename}` : current.client_image;
    const score = rating ? parseInt(rating, 10) : current.rating;

    await db.query(
      'UPDATE testimonials SET client_name = $1, client_company = $2, client_image = $3, rating = $4, review_text = $5 WHERE id = $6',
      [
        client_name || current.client_name,
        client_company !== undefined ? client_company : current.client_company,
        client_image,
        score,
        review_text || current.review_text,
        id
      ]
    );

    const updated = {
      id: parseInt(id, 10),
      client_name: client_name || current.client_name,
      client_company: client_company !== undefined ? client_company : current.client_company,
      client_image,
      rating: score,
      review_text: review_text || current.review_text
    };

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'update_testimonial', `Updated testimonial for client: ${updated.client_name}`]
    );

    emitUpdate(req, 'update', updated);

    res.json({ success: true, message: 'Testimonial updated successfully.', data: updated });
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update testimonial.' });
  }
}

/**
 * Delete testimonial
 */
async function deleteTestimonial(req, res) {
  const { id } = req.params;

  try {
    const testRes = await db.query('SELECT * FROM testimonials WHERE id = $1', [id]);
    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    await db.query('DELETE FROM testimonials WHERE id = $1', [id]);

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'delete_testimonial', `Deleted testimonial for client: ${testRes.rows[0].client_name}`]
    );

    emitUpdate(req, 'delete', { id: parseInt(id, 10) });

    res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete testimonial.' });
  }
}

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
