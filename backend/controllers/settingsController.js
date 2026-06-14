const db = require('../config/db');

/**
 * Public/Admin: Fetch all settings formatted as a key-value object
 */
async function getSettings(req, res) {
  try {
    const result = await db.query('SELECT setting_key, setting_value, group_name FROM website_settings');
    
    // Group and flatten settings into a clean object
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve website configurations' });
  }
}

/**
 * Admin: Batch update website settings keys and values
 */
async function updateSettings(req, res) {
  const updates = req.body; // Expects an object of { key: value }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid settings update request.' });
  }

  try {
    const keys = Object.keys(updates);
    
    for (const key of keys) {
      // Check if setting exists
      const checkSetting = await db.query('SELECT setting_key FROM website_settings WHERE setting_key = $1', [key]);
      
      const val = typeof updates[key] === 'object' ? JSON.stringify(updates[key]) : String(updates[key]);
      
      if (checkSetting.rows.length > 0) {
        // Update existing key
        await db.query(
          'UPDATE website_settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP WHERE setting_key = $2',
          [val, key]
        );
      } else {
        // Insert new key (assume 'general' group by default)
        await db.query(
          "INSERT INTO website_settings (setting_key, setting_value, group_name) VALUES ($1, $2, 'general')",
          [key, val]
        );
      }
    }

    // Save admin activity log
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'update_settings', `Updated system settings: ${keys.join(', ')}`]
    );

    // Fetch and flatten updated settings for returning and socket broadcasting
    const allSettingsRes = await db.query('SELECT setting_key, setting_value FROM website_settings');
    const settings = {};
    allSettingsRes.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    // Broadcast change live over Socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('settings_update', { settings });
    }

    res.json({ success: true, message: 'Website settings updated successfully.', data: settings });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save settings configurations' });
  }
}

module.exports = {
  getSettings,
  updateSettings
};
