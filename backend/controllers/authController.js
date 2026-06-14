const db = require('../config/db');
const { generateToken, comparePassword, hashPassword } = require('../config/auth');

/**
 * Admin Login Handler
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM admins WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

    // Save activity log
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [admin.id, 'login', `Admin logged in successfully from IP: ${req.ip}`]
    );

    // Set cookie (optional browser convenience)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

/**
 * Fetch Admin Profile Data
 */
async function getProfile(req, res) {
  res.json({
    success: true,
    admin: req.admin
  });
}

/**
 * Update Admin Profile Details (Name, Password)
 */
async function updateProfile(req, res) {
  const { name, email, password, currentPassword } = req.body;
  const adminId = req.admin.id;

  try {
    // Check current admin account details
    const result = await db.query('SELECT * FROM admins WHERE id = $1', [adminId]);
    const admin = result.rows[0];

    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;

    if (name) {
      updateFields.push(`name = $${paramIndex++}`);
      queryParams.push(name);
    }

    if (email && email !== admin.email) {
      // Check if email already taken
      const checkEmail = await db.query('SELECT id FROM admins WHERE email = $1 AND id != $2', [email.toLowerCase(), adminId]);
      if (checkEmail.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Email address already in use.' });
      }
      updateFields.push(`email = $${paramIndex++}`);
      queryParams.push(email.toLowerCase());
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Please provide current password to update security settings.' });
      }
      const isMatch = await comparePassword(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password provided is incorrect.' });
      }
      const hashed = await hashPassword(password);
      updateFields.push(`password = $${paramIndex++}`);
      queryParams.push(hashed);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update.' });
    }

    queryParams.push(adminId);
    const updateQuery = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email`;

    // Wait: SQLite does not support RETURNING syntax directly in all versions, let's write a standard safe SQL execution instead
    if (db.dbType === 'sqlite') {
      const sqliteUpdateQuery = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
      await db.query(sqliteUpdateQuery, queryParams);
      
      const updatedUser = await db.query('SELECT id, name, email FROM admins WHERE id = $1', [adminId]);
      
      await db.query(
        'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
        [adminId, 'update_profile', 'Updated profile information.']
      );

      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        admin: updatedUser.rows[0]
      });
    }

    // Postgres / MySQL execution
    const pgRes = await db.query(updateQuery, queryParams);
    
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [adminId, 'update_profile', 'Updated profile information.']
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      admin: pgRes.rows[0]
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
}

/**
 * Fetch Dashboard Statistics Counters
 */
async function getDashboardStats(req, res) {
  try {
    // Total Visitor Views
    const viewsRes = await db.query(
      "SELECT COUNT(*) as total FROM analytics WHERE event_type = 'pageview'"
    );
    const totalVisitors = parseInt(viewsRes.rows[0].total || 0, 10);

    // Total Leads Count
    const leadsRes = await db.query(
      'SELECT COUNT(*) as total FROM contact_leads'
    );
    const totalLeads = parseInt(leadsRes.rows[0].total || 0, 10);

    // Total Active Services
    const servicesRes = await db.query(
      "SELECT COUNT(*) as total FROM services WHERE status = 'active'"
    );
    const totalServices = parseInt(servicesRes.rows[0].total || 0, 10);

    // Total Published Blogs
    const blogsRes = await db.query(
      "SELECT COUNT(*) as total FROM blogs WHERE status = 'published'"
    );
    const totalBlogs = parseInt(blogsRes.rows[0].total || 0, 10);

    // Recent Lead inquiries (last 5)
    const recentLeadsRes = await db.query(
      'SELECT id, name, email, phone, business_type, status, created_at FROM contact_leads ORDER BY created_at DESC LIMIT 5'
    );

    // Traffic Sources (aggregated count per referrer/channel)
    const trafficRes = await db.query(
      'SELECT referrer, COUNT(*) as count FROM analytics WHERE referrer IS NOT NULL AND referrer != "" GROUP BY referrer ORDER BY count DESC LIMIT 5'
    );

    // Recent Activity Logs
    const recentLogsRes = await db.query(
      'SELECT al.*, a.name as admin_name FROM activity_logs al LEFT JOIN admins a ON al.admin_id = a.id ORDER BY al.created_at DESC LIMIT 5'
    );

    res.json({
      success: true,
      stats: {
        totalVisitors,
        totalLeads,
        totalServices,
        totalBlogs
      },
      recentLeads: recentLeadsRes.rows,
      trafficSources: trafficRes.rows,
      recentActivity: recentLogsRes.rows
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
}

module.exports = {
  login,
  getProfile,
  updateProfile,
  getDashboardStats
};
