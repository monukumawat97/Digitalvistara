const db = require('../config/db');

function emitUpdate(req, action, data) {
  const io = req.app.get('socketio');
  if (io) {
    io.emit('team_update', { action, data });
  }
}

/**
 * Get all team members ordered by sort_order
 */
async function getTeamMembers(req, res) {
  try {
    const result = await db.query(
      'SELECT * FROM team_members ORDER BY sort_order ASC, created_at DESC'
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Team Members Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve team members' });
  }
}

/**
 * Add a new team member
 */
async function createTeamMember(req, res) {
  const { name, designation, bio, facebook_url, twitter_url, linkedin_url, sort_order } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !designation) {
    return res.status(400).json({ success: false, message: 'Name and designation are required.' });
  }

  try {
    const order = sort_order ? parseInt(sort_order, 10) : 0;
    const result = await db.query(
      `INSERT INTO team_members (name, designation, bio, photo, facebook_url, twitter_url, linkedin_url, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, designation, bio || null, photo, facebook_url || null, twitter_url || null, linkedin_url || null, order]
    );

    let newMember = { name, designation, bio, photo, facebook_url, twitter_url, linkedin_url, sort_order: order };
    if (db.dbType === 'sqlite' && result.insertId) {
      newMember.id = result.insertId;
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'create_team', `Added team member: ${name}`]
    );

    emitUpdate(req, 'create', newMember);

    res.status(201).json({ success: true, message: 'Team member added successfully.', data: newMember });
  } catch (error) {
    console.error('Create Team Member Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add team member.' });
  }
}

/**
 * Update team member details
 */
async function updateTeamMember(req, res) {
  const { id } = req.params;
  const { name, designation, bio, facebook_url, twitter_url, linkedin_url, sort_order } = req.body;

  try {
    const memberRes = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (memberRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    const current = memberRes.rows[0];
    const photo = req.file ? `/uploads/${req.file.filename}` : current.photo;
    const order = sort_order !== undefined ? parseInt(sort_order, 10) : current.sort_order;

    await db.query(
      `UPDATE team_members SET 
        name = $1, 
        designation = $2, 
        bio = $3, 
        photo = $4, 
        facebook_url = $5, 
        twitter_url = $6, 
        linkedin_url = $7, 
        sort_order = $8 
       WHERE id = $9`,
      [
        name || current.name,
        designation || current.designation,
        bio !== undefined ? bio : current.bio,
        photo,
        facebook_url !== undefined ? facebook_url : current.facebook_url,
        twitter_url !== undefined ? twitter_url : current.twitter_url,
        linkedin_url !== undefined ? linkedin_url : current.linkedin_url,
        order,
        id
      ]
    );

    const updated = {
      id: parseInt(id, 10),
      name: name || current.name,
      designation: designation || current.designation,
      bio: bio !== undefined ? bio : current.bio,
      photo,
      facebook_url: facebook_url !== undefined ? facebook_url : current.facebook_url,
      twitter_url: twitter_url !== undefined ? twitter_url : current.twitter_url,
      linkedin_url: linkedin_url !== undefined ? linkedin_url : current.linkedin_url,
      sort_order: order
    };

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'update_team', `Updated team member: ${updated.name}`]
    );

    emitUpdate(req, 'update', updated);

    res.json({ success: true, message: 'Team member updated successfully.', data: updated });
  } catch (error) {
    console.error('Update Team Member Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update team member.' });
  }
}

/**
 * Remove a team member
 */
async function deleteTeamMember(req, res) {
  const { id } = req.params;

  try {
    const memberRes = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (memberRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    await db.query('DELETE FROM team_members WHERE id = $1', [id]);

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'delete_team', `Removed team member: ${memberRes.rows[0].name}`]
    );

    emitUpdate(req, 'delete', { id: parseInt(id, 10) });

    res.json({ success: true, message: 'Team member removed successfully.' });
  } catch (error) {
    console.error('Delete Team Member Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team member.' });
  }
}

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
