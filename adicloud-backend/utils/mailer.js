const nodemailer = require('nodemailer');

// Create a transporter object using Gmail as the email service.
// The credentials are loaded from environment variables for security.

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends an email using the configured transporter.
 *
 * @param {string|string[]} to - The recipient's email address (or array of addresses).
 * @param {string} subject - The subject line of the email.
 * @param {string} message - The message content (HTML).
 */
const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"Adicloud" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err.message);
  }
};

module.exports = sendEmail;
