import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Determine SSL options based on environment or cloud DB requirement
const getSSLConfig = () => {
  if (process.env.MYSQL_SSL === "false" || process.env.DB_SSL === "false") {
    return false;
  }
  if (
    process.env.MYSQL_SSL === "true" ||
    process.env.DB_SSL === "true" ||
    (process.env.MYSQL_HOST && !process.env.MYSQL_HOST.includes("localhost") && !process.env.MYSQL_HOST.includes("127.0.0.1")) ||
    (process.env.DB_HOST && !process.env.DB_HOST.includes("localhost") && !process.env.DB_HOST.includes("127.0.0.1")) ||
    (process.env.MYSQL_URL && !process.env.MYSQL_URL.includes("localhost"))
  ) {
    return { rejectUnauthorized: false };
  }
  return false;
};

const sslConfig = getSSLConfig();

export const pool = process.env.MYSQL_URL || process.env.DATABASE_URL
  ? mysql.createPool({
      uri: process.env.MYSQL_URL || process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: sslConfig,
    })
  : mysql.createPool({
      host: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
      user: process.env.MYSQL_USER || process.env.DB_USER || "root",
      password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "humanex_db",
      port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: sslConfig,
    });

/**
 * Initializes the database schema.
 * Automatically creates the users table if it does not already exist.
 */
export async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log(" Connected to MySQL database successfully.");

    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('patient', 'doctor', 'hospital') NOT NULL DEFAULT 'patient',
        extra VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createUsersTableQuery);
    console.log(" Users table is verified and ready.");
    connection.release();
    return true;
  } catch (error) {
    console.error(" MySQL connection/initialization warning:", error.message);
    console.log("â„¹ï¸  If you are deploying MySQL in the cloud, configure your credentials in backend/.env");
    return false;
  }
}
