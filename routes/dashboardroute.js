const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");
const {registerSingles, registerDoubles, doublesBoysMatches, doublesGirlsMatches, singlesGirlsMatches, singlesBoysMatches} = require("../models/Matches")

router.get('/players-info', async(req, res)=>{
    try {
        const players = await playerInfo.find();
        const singlesPlayers = await registerSingles.find();
        const doublesPlayers = await registerDoubles.find();
        const singlesBoysMatchesList = await singlesBoysMatches.find();
        const singlesGirlsMatchesList = await singlesGirlsMatches.find();
        const doublesBoysMatchesList = await doublesBoysMatches.find();
        const doublesGirlsMatchesList = await doublesGirlsMatches.find();
        // console.log(players);
        res.json({players, 
            singlesPlayers, 
            doublesPlayers, 
            singlesBoysMatchesList, 
            singlesGirlsMatchesList,
            doublesBoysMatchesList,
            doublesGirlsMatchesList
        });

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
