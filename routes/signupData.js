const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");

router.post("/storeData", async (req, res) => {
    try {
        const stdData = req.body;
        // check if player already exists
        const existingPlayer = await playerInfo.findOne({ email: stdData.email });
        if (existingPlayer) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // create a new player
        const player = new playerInfo(stdData);
        await player.save();

        req.session.user = {
            isLogin : true,
            email: stdData.email,
            admin: false
        };

        // console.log(req.session.user);

        res.status(201).json({ success: true, message: "Player registered successfully", player });
    } catch (error) {
        console.error("Error saving player:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
