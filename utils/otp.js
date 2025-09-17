const nodemailer = require("nodemailer");

async function sendOtpEmail(toEmail, otp) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"PCCOE Badminton" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
      html: `<h2>OTP Verification</h2><p>Your OTP is: <b>${otp}</b></p><p>It is valid for 5 minutes.</p>`,
    };

    // Send mail
    let info = await transporter.sendMail(mailOptions);
    console.log("OTP sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}

module.exports = sendOtpEmail;
