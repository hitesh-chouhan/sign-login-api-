const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/email');
const db = require('../config/db');
const { verifyToken } = require('../middlewares/verifyJWT');
 

// Signup API
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  await User.create(firstName, lastName, email, password);
  res.status(201).json({ message: 'User registered successfully' });
};

// Login API with JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
};

// Forgot Password API - Send Reset Email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 5 * 60 * 1000;

  await User.setResetToken(email, resetToken, resetTokenExpiry);
  const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;
  await sendResetEmail(email, resetLink);

  res.status(200).json({ message: 'Reset password email sent' });
};

// Reset Password API
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findByResetToken(token);
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  await User.updatePassword(user.id, newPassword);
  res.status(200).json({ message: 'Password updated successfully' });
};

// Get User Details API
exports.getUserDetails = async (req, res) => {
  const  userId = req.User;
  const user = await db.query('select * from users where id=?',[userId]);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ user:user[0] });
};