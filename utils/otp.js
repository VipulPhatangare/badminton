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

    // Email content with enhanced HTML
    const mailOptions = {
      from: `"Shuttle Showdown 2025" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP Code for Shuttle Showdown 2025",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification - Shuttle Showdown 2025</title>
          <style>
            :root {
              --primary-red: #B22222;
              --dark-red: #8B0000;
              --light-red: #DC143C;
              --crimson: #DC143C;
              --burgundy: #800020;
              --white: #ffffff;
              --light-gray: #f8f9fa;
              --gray: #6c757d;
              --dark-gray: #343a40;
              --black: #000000;
              --accent-gold: #FFD700;
              --accent-orange: #ff6600;
              --success: #28a745;
              --warning: #ffc107;
              --danger: #dc3545;
              --shadow-light: 0 2px 10px rgba(178, 34, 34, 0.1);
              --shadow-medium: 0 4px 20px rgba(178, 34, 34, 0.15);
              --shadow-heavy: 0 8px 30px rgba(178, 34, 34, 0.25);
              --gradient-red: linear-gradient(135deg, #B22222 0%, #DC143C 50%, #8B0000 100%);
              --gradient-dark: linear-gradient(135deg, #8B0000 0%, #B22222 50%, #800020 100%);
              --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              --transition-fast: all 0.2s ease;
              --border-radius: 12px;
              --border-radius-lg: 20px;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
              color: var(--dark-gray);
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: var(--white);
              border-radius: var(--border-radius-lg);
              overflow: hidden;
              box-shadow: var(--shadow-heavy);
            }
            
            .header {
              background: var(--gradient-red);
              padding: 30px 20px;
              text-align: center;
              color: var(--white);
            }
            
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            
            .header p {
              margin: 10px 0 0;
              font-size: 16px;
              opacity: 0.9;
            }
            
            .content {
              padding: 30px;
            }
            
            .otp-container {
              text-align: center;
              margin: 25px 0;
            }
            
            .otp-code {
              display: inline-block;
              background: var(--gradient-red);
              color: var(--white);
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 15px 25px;
              border-radius: var(--border-radius);
              box-shadow: var(--shadow-medium);
            }
            
            .message {
              text-align: center;
              margin-bottom: 25px;
              line-height: 1.6;
            }
            
            .note {
              background-color: var(--light-gray);
              padding: 15px;
              border-left: 4px solid var(--accent-gold);
              border-radius: 4px;
              margin: 20px 0;
              font-size: 14px;
            }
            
            .footer {
              background-color: var(--dark-gray);
              color: var(--light-gray);
              padding: 20px;
              text-align: center;
              font-size: 12px;
            }
            
            .footer a {
              color: var(--accent-gold);
              text-decoration: none;
            }
            
            .badminton-icon {
              display: inline-block;
              margin-bottom: 15px;
              font-size: 24px;
            }
            
            @media (max-width: 600px) {
              .container {
                margin: 0 10px;
              }
              
              .header {
                padding: 20px 15px;
              }
              
              .content {
                padding: 20px;
              }
              
              .otp-code {
                font-size: 24px;
                letter-spacing: 5px;
                padding: 12px 20px;
              }
            }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="badminton-icon">🏸</div>
                  <h1>Shuttle Showdown 2025</h1>
              </div>
              
              <div class="content">
                  <div class="message">
                      <h2>OTP Verification</h2>
                      <p>Thank you for registering for Shuttle Showdown 2025. Use the OTP below to verify your account:</p>
                  </div>
                  
                  <div class="otp-container">
                      <div class="otp-code">${otp}</div>
                  </div>
                  
                  <div class="message">
                      <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
                  </div>
                  
                  <div class="note">
                      <p><strong>Note:</strong> If you didn't request this OTP, please ignore this email or contact our support team immediately.</p>
                  </div>
              </div>
              
              <div class="footer">
                  <p>&copy; 2025 Shuttle Showdown. All rights reserved.</p>
                  <p>Follow us on social media for updates and announcements</p>
                  <p>Contact us: <a href="mailto:support@shuttleshowdown.com">support@shuttleshowdown.com</a></p>
              </div>
          </div>
      </body>
      </html>
      `,
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