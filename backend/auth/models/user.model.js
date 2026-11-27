import { pool } from "../config/db.js";

export const UserModel = {
  /**
   * Find a user by their unique email address
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by their ID (excludes password)
   */
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, extra, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new user in MySQL
   */
  async create({ name, email, password, role, extra }) {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, extra) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), password, role, extra || null]
    );

    return {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      extra: extra || null,
    };
  },

  /**
   * Get all users (utility/admin query)
   */
  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, extra, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  }
};
