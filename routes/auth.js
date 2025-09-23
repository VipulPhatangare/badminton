const express = require("express");
const router = express.Router();
const sendOtpEmail = require("../utils/otp");
const sendPassEmail = require("../utils/mail");
const { playerInfo, refreeInfo } = require("../models/Player");

// Generate random OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit
}

router.post("/login", async (req, res) => {
  try {
    const { loginEmail, loginPassword, admin } = req.body;

    // Regenerate session (clear old data safely)
    req.session.regenerate(async (err) => {
      if (err) {
        console.error("Session regenerate error:", err);
        return res.status(500).json({ isLogin: false, message: "Session error" });
      }

      if (admin) {
        const existingRefree = await refreeInfo.findOne({ refEmail: loginEmail });
        if (!existingRefree) {
          return res.status(400).json({ isLogin: false, message: "Invalid email.." });
        }

        if (existingRefree.password !== loginPassword) {
          return res.status(400).json({ isLogin: false, message: "Invalid password.." });
        }

        req.session.refree = {
          isLogin: true,
          refEmail: loginEmail,
          refName: existingRefree.name,
          isScorecard: false,
          matchId:'',
          matchType: '',
        };

        return res.status(200).json({ isLogin: true, message: "Login successfully.." });
      } else {
        const existingPlayer = await playerInfo.findOne({ email: loginEmail });
        if (!existingPlayer) {
          return res.status(400).json({ isLogin: false, message: "Invalid email.." });
        }

        if (existingPlayer.password !== loginPassword) {
          return res.status(400).json({ isLogin: false, message: "Invalid password.." });
        }

        req.session.user = {
          isLogin: true,
          email: loginEmail,
        };

        return res.status(200).json({ isLogin: true, message: "Login successfully.." });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ isLogin: false, message: "Server error.." });
  }
});


// OTP route
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  // console.log(email);

  if (!email.endsWith("@pccoepune.org") && !email.endsWith("@sbpatilmba.com") ) {
    return res.status(400).json({ isOptsent: false,message: "Email must end with @pccoepune.org" });
  }

  const otp = generateOtp();
  req.app.locals[email] = otp;

  const sent = await sendOtpEmail(email, otp);
  if (sent) {
    res.json({ isOptsent: true, message: "OTP sent successfully" });
  } else {
    res.status(500).json({ isOptsent: false, error: "Failed to send OTP", message: "Invalid email.." });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (req.app.locals[email] && req.app.locals[email] == otp) {
    delete req.app.locals[email];
    return res.json({ isVerify: true, message: "OTP verified successfully" });
  }
  res.status(400).json({ isVerify: false, message: "Invalid or expired OTP" });
});

// Send password reset
router.post("/send-pass", async (req, res) => {
  const { resetEmail } = req.body;
  try {
    const existingPlayer = await playerInfo.findOne({ email: resetEmail });
    if (!existingPlayer) {
      return res.status(400).json({ isPassSend: false, message: "Invalid email.." });
    }

    const sent = await sendPassEmail(resetEmail, existingPlayer.password);
    if (sent) {
      res.json({ isPassSend: true, message: "Password sent successfully.." });
    } else {
      res.status(500).json({ isPassSend: false, message: "Failed to send password.." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ isPassSend: false, message: "Server error.." });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
