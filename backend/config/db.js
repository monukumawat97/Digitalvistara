const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbType = process.env.DB_TYPE || 'sqlite';
let pool;
let sqliteDb;

// Initialize connection based on DB_TYPE
if (dbType === 'postgres') {
  const { Pool } = require('pg');
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log('Database Connection Manager: Using PostgreSQL');
} else if (dbType === 'mysql') {
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('Database Connection Manager: Using MySQL');
} else {
  // Fallback to SQLite
  const sqlite3 = require('sqlite3').verbose();
  const sqlitePath = path.resolve(__dirname, '..', process.env.DB_SQLITE_PATH || './database/digital_vistara.sqlite');
  
  // Ensure directory exists
  const dir = path.dirname(sqlitePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  sqliteDb = new sqlite3.Database(sqlitePath, (err) => {
    if (err) {
      console.error('SQLite connection error:', err.message);
    } else {
      console.log(`Database Connection Manager: Using SQLite at ${sqlitePath}`);
    }
  });
}

/**
 * Execute an SQL query and return an object with rows.
 * Automatically translates $1, $2 pg-style parameters to ? for MySQL/SQLite.
 * @param {string} text - SQL Query
 * @param {Array} params - Parameter values
 */
async function query(text, params = []) {
  if (dbType === 'postgres') {
    const res = await pool.query(text, params);
    return { rows: res.rows, count: res.rowCount };
  }

  // Convert pg-style placeholders $1, $2 -> ? for MySQL and SQLite
  // e.g. "SELECT * FROM users WHERE id = $1 AND name = $2" -> "SELECT * FROM users WHERE id = ? AND name = ?"
  const normalizedText = text.replace(/\$\d+/g, '?');

  if (dbType === 'mysql') {
    const [rows] = await pool.query(normalizedText, params);
    // Standardize return format
    return { rows: Array.isArray(rows) ? rows : [rows], count: Array.isArray(rows) ? rows.length : 1 };
  }

  // SQLite3 execution (Promise wrapped)
  return new Promise((resolve, reject) => {
    // For writes, use run; for reads, use all
    const isSelect = normalizedText.trim().match(/^select/i);
    
    if (isSelect) {
      sqliteDb.all(normalizedText, params, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows: rows || [], count: rows ? rows.length : 0 });
      });
    } else {
      sqliteDb.run(normalizedText, params, function (err) {
        if (err) return reject(err);
        // lastID and changes are on "this" context
        resolve({ 
          rows: [{ id: this.lastID }], 
          count: this.changes,
          insertId: this.lastID 
        });
      });
    }
  });
}

// Close connection helpers
async function close() {
  if (dbType === 'postgres') {
    await pool.end();
  } else if (dbType === 'mysql') {
    await pool.end();
  } else {
    return new Promise((resolve) => {
      sqliteDb.close(() => resolve());
    });
  }
}

module.exports = {
  query,
  close,
  dbType
};
