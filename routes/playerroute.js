const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");
const { 
    singlesBoysMatches, 
    singlesGirlsMatches, 
    doublesBoysMatches, 
    doublesGirlsMatches 
} = require("../models/Matches");

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
      gender: currentPlayer.gender,   
      doubles: false
    });

    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get('/matches', async (req, res) => {
    try {
        const email = req.session.user.email;
        // email = 'boy5.phanagare23@pccoepune.org';
        const allMatches = [];

        // Fetch matches from all categories where the player is involved
        const singlesBoys = await singlesBoysMatches.find({
            $or: [{ email1: email }, { email2: email }]
        });
        const singlesGirls = await singlesGirlsMatches.find({
            $or: [{ email1: email }, { email2: email }]
        });
        const doublesBoys = await doublesBoysMatches.find({
            $or: [{ teamt1email1: email }, { teamt1email2: email }, { teamt2email1: email }, { teamt2email2: email }]
        });
        const doublesGirls = await doublesGirlsMatches.find({
            $or: [{ teamt1email1: email }, { teamt1email2: email }, { teamt2email1: email }, { teamt2email2: email }]
        });

        // Process singles boys matches
        singlesBoys.forEach(match => {
            allMatches.push({
                ...match.toObject(),
                matchType: 'Singles',
                status: match.isComplete ? 'completed' : (match.status === 'live' ? 'live' : 'upcoming')
            });
        });

        // Process singles girls matches
        singlesGirls.forEach(match => {
            allMatches.push({
                ...match.toObject(),
                matchType: 'Singles',
                status: match.isComplete ? 'completed' : (match.status === 'live' ? 'live' : 'upcoming')
            });
        });

        // Process doubles boys matches
        doublesBoys.forEach(match => {
            allMatches.push({
                ...match.toObject(),
                matchType: 'Doubles',
                status: match.isComplete ? 'completed' : (match.status === 'live' ? 'live' : 'upcoming')
            });
        });

        // Process doubles girls matches
        doublesGirls.forEach(match => {
            allMatches.push({
                ...match.toObject(),
                matchType: 'Doubles',
                status: match.isComplete ? 'completed' : (match.status === 'live' ? 'live' : 'upcoming')
            });
        });

        // console.log(allMatches);
        res.json(allMatches);

    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
