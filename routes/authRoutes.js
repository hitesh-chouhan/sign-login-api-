const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, getUserDetails } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user', authMiddleware, getUserDetails);

module.exports = router;