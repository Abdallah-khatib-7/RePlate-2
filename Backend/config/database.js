const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Empty for XAMPP
  database: process.env.DB_NAME || 'replate_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database via phpMyAdmin');
    
    // List tables
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME || 'replate_db']);
    
    console.log('📊 Database tables:', tables.map(t => t.table_name));
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Check these:');
    console.log('1. Is XAMPP MySQL running? (should be green)');
    console.log('2. Is database "replate_db" created in phpMyAdmin?');
    console.log('3. Is password empty in .env file?');
    console.log('4. Try: http://localhost/phpmyadmin');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};