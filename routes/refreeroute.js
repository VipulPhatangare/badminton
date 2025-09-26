const express = require("express");
const router = express.Router();
const { playerInfo, refreeInfo } = require("../models/Player");
const {registerSingles, registerDoubles, doublesBoysMatches, doublesGirlsMatches, singlesGirlsMatches, singlesBoysMatches} = require("../models/Matches")

router.get('/',(req, res)=>{
    if(req.session.refree){
        res.render('refree');
    }else{
        res.render('index');
    }
});

router.get('/get-matches-info', async(req, res)=>{
    try {

        const refEmail = req.session.refree.refEmail;
        // const refEmail = 'vipulphatangare3@gmail.com';

        const singlesBoysMatchesList = await singlesBoysMatches.find();
        const singlesGirlsMatchesList = await singlesGirlsMatches.find();
        // const doublesBoysMatchesList = await doublesBoysMatches.find();
        // const doublesGirlsMatchesList = await doublesGirlsMatches.find();

        const doublesGirlsMatchesList = await doublesGirlsMatches.aggregate([
            // Lookup for teamt1email1
            {
                $lookup: {
                from: "playerinfos", // collection name (pluralized, check in DB)
                localField: "teamt1email1",
                foreignField: "email",
                as: "teamt1player1"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "teamt1email2",
                foreignField: "email",
                as: "teamt1player2"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "teamt2email1",
                foreignField: "email",
                as: "teamt2player1"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "teamt2email2",
                foreignField: "email",
                as: "teamt2player2"
                }
            },

            // Clean names (only first element, since email is unique)
            {
                $addFields: {
                teamt1player1: { $arrayElemAt: ["$teamt1player1.name", 0] },
                teamt1player2: { $arrayElemAt: ["$teamt1player2.name", 0] },
                teamt2player1: { $arrayElemAt: ["$teamt2player1.name", 0] },
                teamt2player2: { $arrayElemAt: ["$teamt2player2.name", 0] }
                }
            }
        ]);

        const doublesBoysMatchesList = await doublesBoysMatches.aggregate([
            // Lookup for teamt1email1
            {
                $lookup: {
                from: "playerinfos", // collection name (pluralized, check in DB)
                localField: "teamt1email1",
                foreignField: "email",
                as: "teamt1player1"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "teamt1email2",
                foreignField: "email",
                as: "teamt1player2"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "teamt2email1",
                foreignField: "email",
                as: "teamt2player1"
                }
            },
            {
                $lookup: {
                from: "playerinfos",
                localField: "teamt2email2",
                foreignField: "email",
                as: "teamt2player2"
                }
            },

            // Clean names (only first element, since email is unique)
            {
                $addFields: {
                teamt1player1: { $arrayElemAt: ["$teamt1player1.name", 0] },
                teamt1player2: { $arrayElemAt: ["$teamt1player2.name", 0] },
                teamt2player1: { $arrayElemAt: ["$teamt2player1.name", 0] },
                teamt2player2: { $arrayElemAt: ["$teamt2player2.name", 0] }
                }
            }
        ]);

        // console.log(doublesGirlsMatchesList);
        
        const allMatches = []
            .concat(
                singlesBoysMatchesList,
                singlesGirlsMatchesList,
                doublesBoysMatchesList,
                doublesGirlsMatchesList
            );
        // console.log(allMatches);
        const liveMatches = allMatches.filter(match => match.refEmail === refEmail && match.status === 'Live');
        const completedMatches = allMatches.filter(match => match.refEmail === refEmail && match.status === 'Complete');
        const upcomingMatches = allMatches.filter(match => match.status === 'Upcomming');
        return res.json({liveMatches, completedMatches, upcomingMatches});

    } catch (error) {
        console.log(error);
    }
});



router.post('/start-match', async(req, res)=>{
    try {
        const settings = req.body;
        const courtNumber = settings.courtNumber;
        const firstServer = settings.firstServer;
        const matchId = settings.matchId;
        const maxPoints = Number(settings.maxPoints);
        const numberOfSets = Number(settings.numberOfSets);
        const refreeName = req.session.refree.refName;
        const refEmail = req.session.refree.refEmail;

        // console.log(matchId);
        // console.log(settings);

        if(settings.matchType == 'Boys Singles'){

            const set1 = [{
                player1Point: 0,
                player2Point: 0,
                isSetComplete: false,
                serve: firstServer,
            }];

            await singlesBoysMatches.findByIdAndUpdate(
                matchId, 
                {
                    court: courtNumber,
                    refreeName: refreeName,
                    refEmail: refEmail,
                    set: set1,
                    maxSets: numberOfSets,
                    maxSetPoint: maxPoints,
                    status:'Live',
                },
                { new: true }
            );

            req.session.refree.isScorecard = true;
            req.session.refree.matchId = matchId;
            req.session.refree.matchType = settings.matchType;
            return res.json({success: true});

        }else if(settings.matchType == 'Girls Singles'){

            const set1 = [{
                player1Point: 0,
                player2Point: 0,
                isSetComplete: false,
                serve: firstServer,
            }];

            await singlesGirlsMatches.findByIdAndUpdate(
                matchId, 
                {
                    court: courtNumber,
                    refreeName: refreeName,
                    refEmail: refEmail,
                    set: set1,
                    maxSets: numberOfSets,
                    maxSetPoint: maxPoints,
                    status:'Live',
                },
                { new: true }
            );

            req.session.refree.isScorecard = true;
            req.session.refree.matchId = matchId;
            req.session.refree.matchType = settings.matchType;
            return res.json({success: true});

        }else if(settings.matchType == 'Boys Doubles'){
            
            const set1 = [{
                player1Point: 0,
                player2Point: 0,
                isSetComplete: false,
                serve: firstServer,
            }];

            await doublesBoysMatches.findByIdAndUpdate(
                matchId, 
                {
                    court: courtNumber,
                    refreeName: refreeName,
                    refEmail: refEmail,
                    set: set1,
                    maxSets: numberOfSets,
                    maxSetPoint: maxPoints,
                    status:'Live',
                },
                { new: true }
            );

            req.session.refree.isScorecard = true;
            req.session.refree.matchId = matchId;
            req.session.refree.matchType = settings.matchType;
            return res.json({success: true});

        }else if(settings.matchType == 'Girls Doubles'){
            const set1 = [{
                player1Point: 0,
                player2Point: 0,
                isSetComplete: false,
                serve: firstServer,
            }];

            await doublesGirlsMatches.findByIdAndUpdate(
                matchId, 
                {
                    court: courtNumber,
                    refreeName: refreeName,
                    refEmail: refEmail,
                    set: set1,
                    maxSets: numberOfSets,
                    maxSetPoint: maxPoints,
                    status:'Live',
                },
                { new: true }
            );

            req.session.refree.isScorecard = true;
            req.session.refree.matchId = matchId;
            req.session.refree.matchType = settings.matchType;
            return res.json({success: true});
        }

        return res.json({success: false, message: 'Error occure in the start match..'});
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: 'Error occure in the start match..'});
    }
});


router.post('/go-to-scorecard', async(req, res)=>{
    try {

        const {matchType, matchId} = req.body;
        // console.log(matchId, matchType);
        req.session.refree.matchId = matchId;
        req.session.refree.matchType = matchType;
        req.session.refree.isScorecard = true;
        return res.json({success: true});
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: 'Error occure in got to scorecard..'});
    }
});



router.post('/complete-bye-match', async(req, res)=>{
    try {

        const {matchId, matchType} = req.body;

        let model;
        if (matchType === 'Boys Singles') model = singlesBoysMatches;
        if (matchType === 'Girls Singles') model = singlesGirlsMatches;
        if (matchType === 'Boys Doubles') model = doublesBoysMatches;
        if (matchType === 'Girls Doubles') model = doublesGirlsMatches;

        let gender;
        if (matchType === 'Boys Singles') gender = 'Male';
        if (matchType === 'Girls Singles') gender = 'Female';
        if (matchType === 'Boys Doubles') gender = 'Male';
        if (matchType === 'Girls Doubles') gender = 'Female';

        if (!model) return res.json({ success: false });

        const match = await model.findById(matchId);
        if (!match) return res.json({ success: false, message: "Match not found" });


        let winEmail = match.email1 || match.teamt1email1; 
        let winEmail1;
        let winTeamName;
        if((matchType === 'Boys Doubles')|| (matchType === 'Girls Doubles')){
            winEmail1 = match.teamt1email2;
            winTeamName = match.teamName1;
        }
        // console.log(winEmail);
        await model.findByIdAndUpdate(
            matchId,
            {
                $set: {
                    isComplete: true,
                    winnerEmail: winEmail,
                    status: 'Complete'
                }
            },
            { new: true }
        );

        req.session.refree.isScorecard = false;
        
        if((matchType === 'Boys Singles')){
        
                    let nextRound;
                    if(match.round == "round1"){
                        nextRound = "round2"
                    }else if(match.round == "round2"){
                        nextRound = "round3"
                    }else if(match.round == "round3"){
                        nextRound = "quarter"
                    }else if(match.round == "quarter"){
                        nextRound = "semi"
                    }else if(match.round == "semi"){
                        nextRound = "final"
                    }
        
        
                    const player = new registerSingles({ email: winEmail, gender: gender, isAllocated: false, round: nextRound});
                    await player.save();
                }else if((matchType === 'Girls Singles')){
        
        
                    let nextRound;
                    if(match.round == "round1"){
                        nextRound = "quarter"
                    }else if(match.round == "quarter"){
                        nextRound = "semi"
                    }else if(match.round == "semi"){
                        nextRound = "final"
                    }
        
                    
                    const player = new registerSingles({ email: winEmail, gender: gender, isAllocated: false, round: nextRound});
                    await player.save();
                }else if((matchType === 'Boys Doubles')){
        
        
                    let nextRound;
                    if(match.round == "round1"){
                        nextRound = "quarter"
                    }else if(match.round == "quarter"){
                        nextRound = "semi"
                    }else if(match.round == "semi"){
                        nextRound = "final"
                    }
        
                    
                    const player = new registerDoubles({ teamName: winTeamName, email1: winEmail, email2: winEmail1, gender: gender, isAllocated: false, round: nextRound});
                    await player.save();
                }else if((matchType === 'Girls Doubles')){
        
        
                    let nextRound;
                    if(match.round == "round1"){
                        nextRound = "semi"
                    }else if(match.round == "semi"){
                        nextRound = "final"
                    }
        
                    const player = new registerDoubles({ teamName: winTeamName, email1: winEmail, email2: winEmail1, gender: gender, isAllocated: false, round: nextRound});
                    await player.save();
                }

        return res.json({success: true});
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: 'Error occure in got to scorecard..'});
    }
});





module.exports = router;
