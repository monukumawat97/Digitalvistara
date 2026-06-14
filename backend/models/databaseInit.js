const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { hashPassword } = require('../config/auth');

async function initializeDatabase() {
  try {
    console.log('Database Initializer: Checking if tables need initialization...');
    
    // Check if admins table exists (simple indicator of DB initialization)
    let adminExists = false;
    try {
      if (db.dbType === 'postgres') {
        const checkTable = await db.query(
          "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admins'"
        );
        adminExists = checkTable.rows.length > 0;
      } else if (db.dbType === 'mysql') {
        const checkTable = await db.query(
          "SHOW TABLES LIKE 'admins'"
        );
        adminExists = checkTable.rows.length > 0;
      } else {
        // SQLite
        const checkTable = await db.query(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='admins'"
        );
        adminExists = checkTable.rows.length > 0;
      }
    } catch (err) {
      console.log('Error checking database status (might be empty/not created):', err.message);
      adminExists = false;
    }

    if (adminExists) {
      console.log('Database Initializer: Database is already initialized. Skipping creation.');
      return;
    }

    console.log('Database Initializer: Fresh database detected. Creating tables...');

    // Load and run schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split SQL by semicolons, filtering out empty lines
    const schemaStatements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of schemaStatements) {
      await db.query(statement);
    }
    console.log('Database Initializer: Tables created successfully.');

    // Seed data
    console.log('Database Initializer: Seeding base content and settings...');
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    const seedStatements = seedSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of seedStatements) {
      // Basic validation to prevent executing empty lines or comments
      if (statement.startsWith('--') || statement.length < 5) continue;
      await db.query(statement);
    }
    console.log('Database Initializer: Content seeded successfully.');

    // Create default administrator credentials
    const defaultEmail = 'admin@digitalvistara.in';
    const defaultPassword = 'adminpassword123';
    const hashedPassword = await hashPassword(defaultPassword);

    await db.query(
      'INSERT INTO admins (name, email, password, role) VALUES ($1, $2, $3, $4)',
      ['System Administrator', defaultEmail, hashedPassword, 'superadmin']
    );

    console.log('\n======================================================');
    console.log('   DEFAULT ADMIN CREATED SUCCESSFULLY:');
    console.log(`   Email: ${defaultEmail}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('   (Please change this password inside settings immediately)');
    console.log('======================================================\n');

  } catch (error) {
    console.error('Database Initializer Error:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase
};
