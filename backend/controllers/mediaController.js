const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/**
 * Admin: Upload a file (saved via Multer) and store in database library
 */
async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file was uploaded.' });
  }

  try {
    const filename = req.file.filename;
    const filepath = `/uploads/${filename}`;
    const filesize = req.file.size;
    const filetype = req.file.mimetype;

    const result = await db.query(
      'INSERT INTO media_files (file_name, file_path, file_size, file_type) VALUES ($1, $2, $3, $4)',
      [filename, filepath, filesize, filetype]
    );

    let newMedia = { file_name: filename, file_path: filepath, file_size: filesize, file_type: filetype, created_at: new Date() };
    if (db.dbType === 'sqlite' && result.insertId) {
      newMedia.id = result.insertId;
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'upload_file', `Uploaded file to library: ${filename}`]
    );

    res.status(201).json({ success: true, message: 'File uploaded successfully.', data: newMedia });
  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save file details in media library.' });
  }
}

/**
 * Admin: Get list of media files in the library (supports search filters)
 */
async function getMediaFiles(req, res) {
  const { search } = req.query;

  try {
    let queryStr = 'SELECT * FROM media_files';
    const params = [];

    if (search) {
      queryStr += ' WHERE file_name LIKE $1';
      params.push(`%${search}%`);
    }

    queryStr += ' ORDER BY created_at DESC';

    const result = await db.query(queryStr, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get Media Files Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve files from media library.' });
  }
}

/**
 * Admin: Delete a file from disk and database
 */
async function deleteMediaFile(req, res) {
  const { id } = req.params;

  try {
    // Fetch file details
    const mediaRes = await db.query('SELECT * FROM media_files WHERE id = $1', [id]);
    if (mediaRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found in library.' });
    }

    const file = mediaRes.rows[0];
    const diskPath = path.resolve(__dirname, '..', 'uploads', file.file_name);

    // Delete database entry
    await db.query('DELETE FROM media_files WHERE id = $1', [id]);

    // Attempt to delete from disk
    if (fs.existsSync(diskPath)) {
      fs.unlink(diskPath, (err) => {
        if (err) console.error(`Failed to delete disk file ${file.file_name}:`, err.message);
      });
    }

    await db.query(
      'INSERT INTO activity_logs (admin_id, action, details) VALUES ($1, $2, $3)',
      [req.admin.id, 'delete_file', `Deleted file: ${file.file_name}`]
    );

    res.json({ success: true, message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Delete Media Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete file from media library.' });
  }
}

module.exports = {
  uploadFile,
  getMediaFiles,
  deleteMediaFile
};
