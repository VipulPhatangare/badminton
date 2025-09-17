const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");

router.get('/info', async(req, res)=>{
    try {
        const email = req.session.user.email;
        // console.log( req.session.user)
        const playerInformation = await playerInfo.findOne({ email: email });
        // console.log(playerInformation);
        res.json(playerInformation);

    } catch (error) {
        console.log(error);
    }

});

router.get('/allPlayerInfo', async (req, res) => {
  try {
    const email = req.session.user.email;
    // const email = 'vipul.phatangare23@pccoepune.org';
    // First, get the current player's gender
    const currentPlayer = await playerInfo.findOne({ email });
    if (!currentPlayer) {
      return res.status(404).json({ message: "Current player not found" });
    }

    // Query: same gender, exclude the current player's email
    const players = await playerInfo.find({
      email: { $ne: email },             // Exclude current player's email
      gender: currentPlayer.gender       // Match same gender
    });

    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
