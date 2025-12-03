// src/emails/email.service.js
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || `No Reply <${GMAIL_USER}>`;

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

// optional verify at startup (you can log result)
transporter.verify().then(() => {
  console.log("Nodemailer transporter verified");
}).catch(err => {
  console.error("Nodemailer verify failed:", err);
});

function loadTemplate(templateName) {
  const filePath = path.join(__dirname, "templates", templateName);
  return fs.readFileSync(filePath, "utf8");
}

async function sendVerificationEmail(toEmail, verificationUrl) {
  try {
    let html = loadTemplate("verification.html");
    html = html.replace(/{{\s*VERIFICATION_URL\s*}}/g, verificationUrl);

    console.log("URL:", verificationUrl);
console.log("HTML after replace:", html);

    const mailOptions = {
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Verify Your Email",
      text: `Verify your email: ${verificationUrl}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId, "accepted:", info.accepted);
    return { success: true, info };
  } catch (err) {
    console.error("sendVerificationEmail error:", err);
    return { success: false, error: err.message || err.toString() };
  }
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  let html = loadTemplate("reset-password.html");
  html = html.replace(/{{\s*RESET_URL\s*}}/g, resetUrl);

  const mailOptions = {
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Reset Your Password",
    text: `Reset your password: ${resetUrl}`,
    html
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail,sendPasswordResetEmail };
