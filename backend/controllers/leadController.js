const db = require('../config/db');

/**
 * Public: Submit contact lead form. Stores lead in DB and triggers websocket alert for admins.
 */
async function createLead(req, res) {
  const { name, phone, email, business_type, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required fields.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO contact_leads (name, phone, email, business_type, message, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [name, phone || null, email.toLowerCase().trim(), business_type || null, message]
    );

    let newLead = { name, phone, email, business_type, message, status: 'pending', created_at: new Date() };
    if (db.dbType === 'sqlite' && result.insertId) {
      newLead.id = result.insertId;
    }

    // Trigger realtime admin notification
    const io = req.app.get('socketio');
    if (io) {
      // Send a general notification alert
      io.emit('new_lead_notification', {
        message: `New Inquiry from ${name} (${business_type || 'General Inquiry'})`,
        lead: newLead
      });
      // Increment dashboard counters live
      io.emit('dashboard_counters_update');
    }

    // Insert system notification log
    await db.query(
      "INSERT INTO notifications (message, type) VALUES ($1, 'lead')",
      [`New lead submitted: ${name} (${email})`]
    );

    res.status(201).json({ success: true, message: 'Message received! We will contact you shortly.' });
  } catch (error) {
    console.error('Create Lead Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while saving your message. Please try again.' });
  }
}

/**
 * Admin: Get contact leads (with search & status filters)
 */
async function getLeads(req, res) {
  const { search, status } = req.query;

  try {
    let queryStr = 'SELECT * FROM contact_leads WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      queryStr += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      queryStr += ` AND (name LIKE $${paramIndex} OR email LIKE $${paramIndex} OR message LIKE $${paramIndex} OR business_type LIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    queryStr += ' ORDER BY created_at DESC';

    const result = await db.query(queryStr, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Leads Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve leads' });
  }
}

/**
 * Admin: Update lead status & add notes
 */
async function updateLead(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const checkLead = await db.query('SELECT * FROM contact_leads WHERE id = $1', [id]);
    if (checkLead.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    const current = checkLead.rows[0];
    const newStatus = status || current.status;
    const newNotes = notes !== undefined ? notes : current.notes;

    await db.query(
      'UPDATE contact_leads SET status = $1, notes = $2 WHERE id = $3',
      [newStatus, newNotes, id]
    );

    res.json({ 
      success: true, 
      message: 'Lead updated successfully.', 
      data: { id: parseInt(id, 10), status: newStatus, notes: newNotes } 
    });
  } catch (error) {
    console.error('Update Lead Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update lead status.' });
  }
}

/**
 * Admin: Export all leads as CSV file
 */
async function exportLeadsCSV(req, res) {
  try {
    const result = await db.query('SELECT * FROM contact_leads ORDER BY created_at DESC');
    const leads = result.rows;

    // Set CSV Headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_' + Date.now() + '.csv');

    // Helper to sanitize fields for CSV representation
    const cleanField = (field) => {
      if (field === null || field === undefined) return '';
      let str = String(field).replace(/"/g, '""'); // Escape quotes
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        str = `"${str}"`; // Wrap in quotes if special characters exist
      }
      return str;
    };

    // Header row
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Business Type', 'Message', 'Status', 'Notes', 'Date Submitted'];
    let csvContent = headers.join(',') + '\n';

    // Rows
    for (const lead of leads) {
      const row = [
        lead.id,
        cleanField(lead.name),
        cleanField(lead.email),
        cleanField(lead.phone),
        cleanField(lead.business_type),
        cleanField(lead.message),
        cleanField(lead.status),
        cleanField(lead.notes),
        lead.created_at
      ];
      csvContent += row.join(',') + '\n';
    }

    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export CSV Error:', error);
    res.status(500).send('Failed to generate CSV export file');
  }
}

module.exports = {
  createLead,
  getLeads,
  updateLead,
  exportLeadsCSV
};
