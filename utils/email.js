const nodemailer = require('nodemailer');

exports.sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};