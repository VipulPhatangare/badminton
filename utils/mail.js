const nodemailer = require("nodemailer");

async function sendPassEmail(toEmail, password) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your Gmail app password (not normal password)
      },
    });

    // Email content
    const mailOptions = {
      from: `"PCCOE Badminton" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Password",
      text: `Your password is: ${password}. Please keep it safe.`,
      html: `
        <h2>Login Credentials</h2>
        <p>Your password is: <b>${password}</b></p>
        <p>Please do not share it with anyone.</p>
      `,
    };

    // Send mail
    let info = await transporter.sendMail(mailOptions);
    console.log("Password sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password:", error);
    return false;
  }
}

module.exports = sendPassEmail;
