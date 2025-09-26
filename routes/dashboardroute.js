const express = require("express");
const router = express.Router();
const { playerInfo, refreeInfo } = require("../models/Player");
const {registerSingles, registerDoubles, doublesBoysMatches, doublesGirlsMatches, singlesGirlsMatches, singlesBoysMatches} = require("../models/Matches")


router.get("/", (req, res)=>{
  let isLogin = false;
  if(req.session && req.session.admin && req.session.admin.isLogin){ // ✅ Check if admin exists first
    isLogin = true;
  }
  res.render("dashboard",{isLogin});
});


router.get('/players-info', async(req, res)=>{
    try {
        const players = await playerInfo.find();
        const singlesPlayers = await registerSingles.find();
        const doublesPlayers = await registerDoubles.find();
        const singlesBoysMatchesList = await singlesBoysMatches.find();
        const singlesGirlsMatchesList = await singlesGirlsMatches.find();
        const doublesBoysMatchesList = await doublesBoysMatches.find();
        const doublesGirlsMatchesList = await doublesGirlsMatches.find();
        
        res.json({
            players, 
            singlesPlayers, 
            doublesPlayers, 
            singlesBoysMatchesList, 
            singlesGirlsMatchesList,
            doublesBoysMatchesList,
            doublesGirlsMatchesList
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/delete-player', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the player first
    const player = await playerInfo.findOne({ email });
    if (!player) {
      return res.status(404).json({ isDelete: false, message: "Player not found" });
    }

    // Delete the player info
    await playerInfo.deleteOne({ email });

    // If the player was registered for singles, remove them
    if (player.singles) {
      await registerSingles.deleteOne({ email });
    }

    // If the player was registered for doubles, remove their doubles entry
    if (player.doubles) {
      // Check if they are player1
      const player1 = await registerDoubles.findOne({ email1: email });
      if (player1) {
        await registerDoubles.deleteOne({ email1: email });

        // Update the partner's doubles flag to false
        await playerInfo.findOneAndUpdate(
          { email: player1.email2 },
          { $set: { doubles: false } },
          { new: true }
        );
      } else {
        // Check if they are player2
        const player2 = await registerDoubles.findOne({ email2: email });
        if (player2) {
          await registerDoubles.deleteOne({ email2: email });

          // Update the partner's doubles flag to false
          await playerInfo.findOneAndUpdate(
            { email: player2.email1 },
            { $set: { doubles: false } },
            { new: true }
          );
        }
      }
    }

    return res.json({ isDelete: true, message: "Player deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isDelete: false, message: "Error deleting player!" });
  }
});

router.post('/deregister-player', async(req, res)=>{
    try {
        const {email, category} = req.body;
        
        // Convert category to lowercase for case-insensitive comparison
        const categoryLower = category.toLowerCase();
        
        // Check if player exists
        const player = await playerInfo.findOne({ email });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        
        if(categoryLower === 'singles'){
            // Check if player is registered for singles
            if (!player.singles) {
                return res.status(400).json({ success: false, message: "Player is not registered for singles" });
            }
            
            await playerInfo.findOneAndUpdate(
                { email: email },
                { $set: { singles: false } },
                { new: true }
            );

            await registerSingles.deleteOne({email: email});
            return res.json({success: true, message: 'Successfully removed from singles'});
        }

        if(categoryLower === 'doubles'){
            // Check if player is registered for doubles
            if (!player.doubles) {
                return res.status(400).json({ success: false, message: "Player is not registered for doubles" });
            }
            
            await playerInfo.findOneAndUpdate(
                { email: email },
                { $set: { doubles: false } },
                { new: true }
            );

            const player1 = await registerDoubles.findOne({ email1: email });
            if (player1) {
                await registerDoubles.deleteOne({ email1: email });

                // Update the partner's doubles flag to false
                await playerInfo.findOneAndUpdate(
                    { email: player1.email2 },
                    { $set: { doubles: false } },
                    { new: true }
                );
            } else {
                // Check if they are player2
                const player2 = await registerDoubles.findOne({ email2: email });
                if (player2) {
                    await registerDoubles.deleteOne({ email2: email });

                    // Update the partner's doubles flag to false
                    await playerInfo.findOneAndUpdate(
                        { email: player2.email1 },
                        { $set: { doubles: false } },
                        { new: true }
                    );
                }
            }
            return res.json({success: true, message: 'Successfully removed from doubles'});
        }
        
        // If category is not singles or doubles
        return res.status(400).json({ success: false, message: "Invalid category. Must be 'singles' or 'doubles'" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Error deregistering player' });
    }
});


router.post('/delete-match', async (req, res) => {
  try {
    const match = req.body;
    if(match.matchType == 'Boys Singles'){
      await singlesBoysMatches.deleteOne({email1: match.email1});

      await registerSingles.findOneAndUpdate(
        {email: match.email1},
        { $set: { isAllocated: false } },
        { new: true }
      );

      await registerSingles.findOneAndUpdate(
        {email: match.email2},
        { $set: { isAllocated: false } },
        { new: true }
      );

      return res.json({ isDelete: true, message: "Match deleted successfully!" });
    }

    if(match.matchType == 'Girls Singles'){
      await singlesGirlsMatches.deleteOne({email1: match.email1});

      await registerSingles.findOneAndUpdate(
        {email: match.email1},
        { $set: { isAllocated: false } },
        { new: true }
      );

      await registerSingles.findOneAndUpdate(
        {email: match.email2},
        { $set: { isAllocated: false } },
        { new: true }
      );
      return res.json({ isDelete: true, message: "Match deleted successfully!" });
    }

    if(match.matchType == 'Boys Doubles'){
      await doublesBoysMatches.deleteOne({teamt1email1: match.teamt1email1});
      await registerDoubles.findOneAndUpdate(
        {email1: match.teamt1email1},
        { $set: { isAllocated: false } },
        { new: true }
      );

      await registerDoubles.findOneAndUpdate(
        {email1: match.teamt2email1},
        { $set: { isAllocated: false } },
        { new: true }
      );
      return res.json({ isDelete: true, message: "Match deleted successfully!" });
    }

    if(match.matchType == 'Girls Doubles'){
      await doublesGirlsMatches.deleteOne({teamt1email1: match.teamt1email1});
      await registerDoubles.findOneAndUpdate(
        {email1: match.teamt1email1},
        { $set: { isAllocated: false } },
        { new: true }
      );

      await registerDoubles.findOneAndUpdate(
        {email1: match.teamt2email1},
        { $set: { isAllocated: false } },
        { new: true }
      );
      return res.json({ isDelete: true, message: "Match deleted successfully!" });
    }

    
   
    return res.json({ isDelete: false, message: "Error deleting match !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isDelete: false, message: "Error deleting match !" });
  }
});


router.get('/allSinglesInfoMatches', async(req, res)=>{
  try {
    const result = await registerSingles.aggregate([
      {
        $lookup: {
          from: "playerinfos", // collection name of playerInfo
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
    
    res.json(result);

  } catch (error) {
    console.log(error);
  }
});


router.post('/save-shedule-type', (req, res)=>{
  try {
    const {data1} = req.body;
    req.session.typeOfMatch = data1;
    // console.log(req.session.typeOfMatch);
    res.json({success: true});
  } catch (error) {
    console.log(error);
    res.json({success: false});
  }
});

router.get('/get-refree-info', async(req, res)=>{
  try {
    const refree = await refreeInfo.find();
    return res.json(refree);

  } catch (error) {
    console.log(error);
  }
});


// Download round-wise registration data
router.post('/download-round-data', async(req, res) => {
    try {
        const { category, round } = req.body;
        const Excel = require('exceljs');
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Registration Data');

        if (category.includes('singles')) {
            // Set up columns for singles
            worksheet.columns = [
                { header: 'Player Name', key: 'name', width: 30 }
            ];

            const query = {
                round: round,
                gender: category.startsWith('boys') ? 'Male' : 'Female'
            };

            const players = await registerSingles.find(query);
            const playerDetails = [];

            // Get player details for each registration
            for (const registration of players) {
                const player = await playerInfo.findOne({ email: registration.email });
                if (player) {
                    playerDetails.push({
                        name: player.name
                    });
                }
            }

            // Add data to worksheet
            playerDetails.forEach(player => {
                worksheet.addRow(player);
            });

        } else {
            // Set up columns for doubles
            worksheet.columns = [
                { header: 'Team Name', key: 'teamName', width: 35 },
                { header: 'Player 1', key: 'player1', width: 30 },
                { header: 'Player 2', key: 'player2', width: 30 }
            ];

            const query = {
                round: round,
                gender: category.startsWith('boys') ? 'Male' : 'Female'
            };

            const teams = await registerDoubles.find(query);
            const teamDetails = [];

            // Get team details
            for (const team of teams) {
                // console.log(team);
                const player1 = await playerInfo.findOne({ email: team.email1 });
                const player2 = await playerInfo.findOne({ email: team.email2 });
                
                if (player1 && player2) {
                    teamDetails.push({
                        teamName: team.teamName,
                        player1: player1.name,
                        player2: player2.name
                    });
                }
            }

            // Add data to worksheet
            teamDetails.forEach(team => {
                worksheet.addRow(team);
            });
        }

        // Style the worksheet
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '1a3c6e' }
        };
        worksheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

        // Add borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=registration-data.xlsx');
        
        // Send the file
        res.send(buffer);

    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: 'Error generating Excel file' });
    }
});

router.post('/add-refree', async(req, res)=>{
  try {
    const refree = req.body;
    const isRefree = await refreeInfo.find({refEmail: refree.refEmail});
    console.log(isRefree);
    if(isRefree.length != 0){
      return res.json({success: false, message: 'Refree email alredy register..'});
    }
    const ref = new refreeInfo(refree);
    await ref.save();
    res.json({success: true, message: 'Referee added successfully!'});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: 'Error occur in adding refree..'});
  }
});


module.exports = router;