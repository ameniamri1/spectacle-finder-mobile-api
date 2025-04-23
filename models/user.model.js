
const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs');

// User Model (for authentication purposes)
const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      // Note: You would need to create a 'users' table in your database
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create a new user
  create: async (userData) => {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [userData.name, userData.email, hashedPassword]
      );

      return { 
        id: result.insertId, 
        name: userData.name, 
        email: userData.email 
      };
    } catch (error) {
      throw error;
    }
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User;
