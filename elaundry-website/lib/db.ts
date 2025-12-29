// CREATE DATABASE IF NOT EXISTS laundry_app;
// USE laundry_app;

// CREATE TABLE IF NOT EXISTS bookings (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(150) NOT NULL,
//   phone VARCHAR(30),
//   email VARCHAR(255),
//   address TEXT,
//   service_type VARCHAR(100),
//   pricing_plan VARCHAR(100),
//   pickup_date DATE,
//   pickup_time TIME,
//   instructions TEXT,
//   amount_in_paise INT NOT NULL,
//   status ENUM('pending','paid','failed','cancelled') DEFAULT 'pending',
//   razorpay_order_id VARCHAR(128),
//   razorpay_payment_id VARCHAR(128),
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );



///////////////////////////////////////


// lib/db.ts
// ---------------------------------------
// 1. Import mysql2 with promise support
import mysql from 'mysql2/promise';

// ---------------------------------------
// 2. Create a global type for hot reload (Next.js dev mode)
declare global {
  var __db: mysql.Pool | undefined;
}

// ---------------------------------------
// 3. Create MySQL connection pool (best practice)
const createPool = () =>
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'laundry_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

// ---------------------------------------
// 4. Use existing pool in dev (prevents multiple connections)
export const db = global.__db ?? createPool();

// ---------------------------------------
// 5. Save pool globally in dev mode
if (process.env.NODE_ENV !== 'production') global.__db = db;

// ---------------------------------------
// 6. Simple function: fetch rows
export async function query(sql: string, params: any[] = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

// ---------------------------------------
// 7. Insert function (returns insertId)
export async function insert(sql: string, params: any[] = []) {
  const [result]: any = await db.execute(sql, params);
  return result.insertId;
}

// ---------------------------------------
// 8. Update or delete function
export async function execute(sql: string, params: any[] = []) {
  const [result] = await db.execute(sql, params);
  return result;
}

// ---------------------------------------
// 9. Test connection (optional)
export async function testDB() {
  try {
    await db.query('SELECT 1');
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('MySQL connection failed', err);
  }
}

// ---------------------------------------
// 10. Export default
export default db;
