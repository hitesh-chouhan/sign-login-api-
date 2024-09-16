const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async create(firstName, lastName, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', 
      [firstName, lastName, email, hashedPassword]);
  },

  async updatePassword(userId, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  },

  async setResetToken(email, token, expiry) {
    await db.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', 
      [token, expiry, email]);
  },

  async findByResetToken(token) {
    const [rows] = await db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?', 
      [token, Date.now()]);
    return rows[0];
  }
};

module.exports = User;