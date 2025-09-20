const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");
const {registerSingles, registerDoubles, doublesBoysMatches, doublesGirlsMatches, singlesGirlsMatches, singlesBoysMatches} = require("../models/Matches")

router.get('/',(req, res)=>{
    res.render('shedule',{typeOfMatch: 'GD'});
});

router.post('/player-info', async(req, res)=>{
    try {
        const {gender} = req.body;
        const result = await registerSingles.aggregate([
            {
                $match: { gender: gender }  
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "email",
                foreignField: "email",
                as: "player"
                }
            },
            {
                $project: {
                gender: 1,
                isAllocated: 1,
                "player.name": 1,
                "player.email": 1,
                "player.prn": 1
                }
            }
        ]);
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.json({error});
    }
});

router.post('/team-info', async(req, res)=>{
    try {
        const {gender} = req.body;
        const result = await registerDoubles.aggregate([
            {
                $match: { gender: gender } // ✅ filter doubles by gender (team gender)
            },
            {
                $lookup: {
                from: "playerinfos",       // collection name of playerInfo
                localField: "email1",      // first player email
                foreignField: "email",
                as: "player1"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "email2",      // second player email
                foreignField: "email",
                as: "player2"
                }
            },
            {
                $project: {
                teamName: 1,
                gender: 1,
                isAllocated: 1,
                "player1.name": 1,
                "player1.prn": 1,
                "player1.email": 1,
                "player2.name": 1,
                "player2.prn": 1,
                "player2.email": 1
                }
            }
        ]);

        return res.json(result);

    } catch (error) {
        console.log(error);
    }
});

router.post('/allocated-matches',async (req, res)=>{
    try {
        const {typeOfMatch} = req.body;
        if(typeOfMatch == 'BS'){
            
        }
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;
