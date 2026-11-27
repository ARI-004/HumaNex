-- SQL Schema for HumaNex Authentication & Authorization
-- Can be run directly in Cloud MySQL (Aiven, TiDB Cloud, AWS RDS, PlanetScale, Railway, Supabase, etc.)

CREATE DATABASE IF NOT EXISTS humanex_db;
USE humanex_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'hospital') NOT NULL DEFAULT 'patient',
  extra VARCHAR(255) DEFAULT NULL COMMENT 'DOB for patient, Reg Number for doctor, Hospital Name for hospital admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
