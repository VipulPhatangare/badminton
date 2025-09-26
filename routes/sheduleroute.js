const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");
const {registerSingles, registerDoubles, doublesBoysMatches, doublesGirlsMatches, singlesGirlsMatches, singlesBoysMatches, matchCounter} = require("../models/Matches")

router.get('/',(req, res)=>{
    const typeOfMatch = req.session.typeOfMatch;
    const matchRound = req.session.sheduleRound;
    // console.log(typeOfMatch);
    res.render('shedule',{typeOfMatch, matchRound});
});

router.post('/player-info', async(req, res)=>{
    try {
        const {gender, matchRound} = req.body;
        const result = await registerSingles.aggregate([
            {
                $match: { gender: gender , round: matchRound}  
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
        const {gender, matchRound} = req.body;
        const result = await registerDoubles.aggregate([
            {
                $match: { gender: gender , round: matchRound} // ✅ filter doubles by gender (team gender)
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
        const {typeOfMatch, gender} = req.body;
        if(typeOfMatch == 'BS' || typeOfMatch == 'GS'){
            if(gender == 'Male'){
                const result = await singlesBoysMatches.find();
                return res.json(result); 
            }else{
                const result = await singlesGirlsMatches.find();
                return res.json(result); 
            }
        }else{
            if(gender == 'Male'){
                const result = await doublesBoysMatches.find();
                return res.json(result); 
            }else{
                const result = await doublesGirlsMatches.find();
                return res.json(result); 
            }
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/match-counter', async(req, res)=>{
    try {
        const matchCounters = await matchCounter.find({id:'vipulPha'});
        return res.json(matchCounters);
    } catch (error) {
        console.log(error);
    }
});


router.post('/allocate-match', async(req, res)=>{
    try {
        const {match, typeOfMatch} = req.body;
        // console.log(typeOfMatch);
        if(typeOfMatch == 'BS' || typeOfMatch == 'GS'){
            if(typeOfMatch == 'BS'){
                const matches = new singlesBoysMatches(match);
                await matches.save();

                await matchCounter.findOneAndUpdate(
                    {id: "vipulPha"},
                    { $inc: { singlesBoysMatchesCount: 1 } },
                    {new: true}
                );
                // console.log('Boys singles done');
            }else{
                const matches = new singlesGirlsMatches(match);
                await matches.save();

                await matchCounter.findOneAndUpdate(
                    {id: "vipulPha"},
                    { $inc: { singlesGirlsMatchesCount: 1 } },
                    {new: true}
                );
                // console.log('Girls singles done');
            }

            await registerSingles.findOneAndUpdate(
                { email: match.email1, round: match.round },
                { $set: { isAllocated: true} },
                { new: true } 
            );

            if(!match.isBye){
                await registerSingles.findOneAndUpdate(
                    { email: match.email2 , round: match.round},
                    { $set: { isAllocated: true} },
                    { new: true } 
                );
            }
        }else{
            if(typeOfMatch == 'BD'){
                const matches = new doublesBoysMatches(match);
                await matches.save();

                await matchCounter.findOneAndUpdate(
                    {id: "vipulPha"},
                    { $inc: { doublesBoysMatchesCount: 1 } },
                    {new: true}
                );
                // console.log('Boys double done');
            }else{
                const matches = new doublesGirlsMatches(match);
                await matches.save();

                await matchCounter.findOneAndUpdate(
                    {id: "vipulPha"},
                    { $inc: { doublesGirlsMatchesCount: 1 } },
                    {new: true}
                );
                // console.log('Girls double done');
            }

            await registerDoubles.findOneAndUpdate(
                { email1: match.teamt1email1 ,  round: match.round},
                { $set: { isAllocated: true} },
                { new: true } 
            );

            if(!match.isBye){
                await registerDoubles.findOneAndUpdate(
                    { email1: match.teamt2email1, round: match.round },
                    { $set: { isAllocated: true} },
                    { new: true } 
                );
            }
        }

        return res.json({success: true, message: 'Successfully match allocate..'});
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: 'Error in allocating match'});
    }
});

module.exports = router;
