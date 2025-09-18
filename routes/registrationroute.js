const express = require("express");
const router = express.Router();
const { registerSingles, registerDoubles } = require("../models/Matches");
const { playerInfo } = require("../models/Player");

// Single registration
router.get('/single-register', async (req, res) => {
    const email = req.session.user.email;
    try {
        const existingPlayer = await registerSingles.findOne({ email });
        if (existingPlayer) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }
        const playerInformation = await playerInfo.findOne({email});
        let gender = playerInformation.gender; 
        
        await playerInfo.findOneAndUpdate(
            { email: email },
            { $set: { singles: true } },
            { new: true } 
        );

        const player = new registerSingles({ email, gender});
        await player.save();
        return res.json({ success: true, message: "Successfully registered." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

// Double registration
router.post('/double-register', async (req, res) => {
    const { tname, email2 , email1, gender} = req.body;
    const teamName = tname;
    
    if (!teamName || !email2) {
        return res.status(400).json({ success: false, message: "Team name and partner email are required." });
    }

    try {
        const existingPlayer = await registerDoubles.findOne({ email1 });
        if (existingPlayer) {
            return res.status(400).json({ success: false, message: "Team already registered." });
        }


        await playerInfo.findOneAndUpdate(
            { email: email1 },
            { $set: { doubles: true} },
            { new: true } 
        );

        await playerInfo.findOneAndUpdate(
            { email: email2 },
            { $set: { doubles: true} },
            { new: true } 
        );

        const player = new registerDoubles({ teamName, email1, email2, gender });
        await player.save();
        return res.json({ success: true, message: "Successfully registered." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

// Check registration
router.get('/check-register', async (req, res) => {
    const email = req.session.user.email;
    try {
        const singleRegister = await registerSingles.findOne({ email });
        const doubleRegister1 = await registerDoubles.findOne({ email1: email });
        const doubleRegister2 = await registerDoubles.findOne({ email2: email });

        const sendData = {
            singles: !!singleRegister,
            doubles: false
        };

        // console.log(doubleRegister1);
        // console.log(doubleRegister2);

        if (doubleRegister1 || doubleRegister2) {
            sendData.doubles = true;
            const team = doubleRegister1 || doubleRegister2;
            sendData.teamName = team.teamName;

            const partnerEmail = doubleRegister1 ? team.email2 : team.email1;
            const partnerInfo = await playerInfo.findOne({ email: partnerEmail });
            sendData.playerName2 = partnerInfo ? partnerInfo.name : "Unknown";
        }
        // console.log(sendData);
        return res.json(sendData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

module.exports = router;
