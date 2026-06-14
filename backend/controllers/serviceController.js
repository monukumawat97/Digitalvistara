const db = require('../config/db');

/**
 * Emit Socket.io update event to all connected clients
 */
function emitUpdate(req, action, data) {
  const io = req.app.get('socketio');
  if (io) {
    io.emit('services_update', { action, data });
  }
}

/**
 * Get active services for public website (ordered by sort_order)
 */
async function getServices(req, res) {
  try {
    const result = await db.query(
      "SELECT * FROM services WHERE status = 'active' ORDER BY sort_order ASC, created_at DESC"
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Services Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve services' });
  }
}

/**
 * Get all services for admin dashboard
 */
async function getAllServices(req, res) {
  try {
    const result = await db.query(
      "SELECT * FROM services ORDER BY sort_order ASC, created_at DESC"
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get All Services Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve services' });
  }
}

/**
 * Create a new service package
 */
async function createService(req, res) {
  const { title, description, icon, price, status, sort_order } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required fields.' });
  }

  try {
    const order = sort_order ? parseInt(sort_order, 10) : 0;
    const result = await db.query(
      'INSERT INTO services (title, description, icon, image, price, status, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [title, description, icon || 'briefcase', image, price || null, status || 'active', order]
    );

    // SQLite doesn't support RETURNING, query again or return insert ID
    let newService = { title, description, icon, image, price, status, sort_order: order };
    if (db.dbType === 'sqlite' && result.insertId) {
      newService.id = result.insertId;
    }

    // Save admin log
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'create_service', `Created service: ${title}`]
    );

    // Emit live WebSocket update
    emitUpdate(req, 'create', newService);

    res.status(201).json({ success: true, message: 'Service created successfully.', data: newService });
  } catch (error) {
    console.error('Create Service Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
}

/**
 * Update a service
 */
async function updateService(req, res) {
  const { id } = req.params;
  const { title, description, icon, price, status, sort_order } = req.body;

  try {
    // Check if service exists
    const serviceRes = await db.query('SELECT * FROM services WHERE id = $1', [id]);
    if (serviceRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const currentService = serviceRes.rows[0];
    const image = req.file ? `/uploads/${req.file.filename}` : currentService.image;
    const order = sort_order ? parseInt(sort_order, 10) : currentService.sort_order;

    await db.query(
      'UPDATE services SET title = $1, description = $2, icon = $3, image = $4, price = $5, status = $6, sort_order = $7 WHERE id = $8',
      [
        title || currentService.title,
        description || currentService.description,
        icon || currentService.icon,
        image,
        price !== undefined ? price : currentService.price,
        status || currentService.status,
        order,
        id
      ]
    );

    const updatedService = {
      id: parseInt(id, 10),
      title: title || currentService.title,
      description: description || currentService.description,
      icon: icon || currentService.icon,
      image,
      price: price !== undefined ? price : currentService.price,
      status: status || currentService.status,
      sort_order: order
    };

    // Save admin log
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'update_service', `Updated service: ${updatedService.title}`]
    );

    // Emit live WebSocket update
    emitUpdate(req, 'update', updatedService);

    res.json({ success: true, message: 'Service updated successfully.', data: updatedService });
  } catch (error) {
    console.error('Update Service Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
}

/**
 * Delete a service
 */
async function deleteService(req, res) {
  const { id } = req.params;

  try {
    // Check if service exists
    const serviceRes = await db.query('SELECT * FROM services WHERE id = $1', [id]);
    if (serviceRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const service = serviceRes.rows[0];
    await db.query('DELETE FROM services WHERE id = $1', [id]);

    // Save admin log
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'delete_service', `Deleted service: ${service.title}`]
    );

    // Emit live WebSocket update
    emitUpdate(req, 'delete', { id: parseInt(id, 10) });

    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Delete Service Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
}

module.exports = {
  getServices,
  getAllServices,
  createService,
  updateService,
  deleteService
};
