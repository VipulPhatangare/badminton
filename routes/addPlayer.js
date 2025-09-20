

const express = require("express");
const router = express.Router();
const { playerInfo } = require("../models/Player");
const {registerSingles, registerDoubles, doublesBoysMatches, doublesGirlsMatches, singlesGirlsMatches, singlesBoysMatches} = require("../models/Matches")



// async function seed() {
//   try {
   
//     const players = [];

//     // 32 boys
//     for (let i = 1; i <= 32; i++) {
//       players.push({
//         name: `Boy${i}`,
//         gender: "Male",
//         password: "123456",
//         phone: `90000000${i.toString().padStart(2, "0")}`,
//         email: `boy${i}.phanagare23@pccoepune.org`,
//         prn: `PRNBOY${i}`,
//         year: "SE",
//         branch: "CSE",
//         doubles: true,
//         singles: true,
//       });
//     }

//     // 32 girls
//     for (let i = 1; i <= 32; i++) {
//       players.push({
//         name: `Girl${i}`,
//         gender: "Female",
//         password: "123456",
//         phone: `80000000${i.toString().padStart(2, "0")}`,
//         email: `girl${i}.phanagare23@pccoepune.org`,
//         prn: `PRNGIRL${i}`,
//         year: "SE",
//         branch: "CSE",
//         doubles: true,
//         singles: true,
//       });
//     }

//     // Insert players
//     await playerInfo.insertMany(players);
//     console.log("👤 Players inserted:", players.length);

//     // Register Singles
//     const singles = players.map((p) => ({
//       email: p.email,
//       gender: p.gender,
//       isAllocated: false
//     }));
//     await registerSingles.insertMany(singles);
//     console.log("🏸 Singles registered:", singles.length);

//     // Register Doubles (pairing every 2 players of same gender)
//     const doubles = [];
//     // Boys
//     for (let i = 0; i < 32; i += 2) {
//       doubles.push({
//         teamName: `Team_Boy${i / 2 + 1}`,
//         email1: players[i].email,
//         email2: players[i + 1].email,
//         gender: "Male",
//         isAllocated: false
//       });
//     }
//     // Girls
//     for (let i = 32; i < 64; i += 2) {
//       doubles.push({
//         teamName: `Team_Girl${(i - 32) / 2 + 1}`,
//         email1: players[i].email,
//         email2: players[i + 1].email,
//         gender: "Female",
//         isAllocated: false
//       });
//     }

//     await registerDoubles.insertMany(doubles);
//     console.log("👯 Doubles registered:", doubles.length);

//     console.log("✅ Dummy data inserted successfully!");
//   } catch (err) {
//     console.error("❌ Error:", err);
//   }
// }


router.get('/',async(req, res)=>{
  try {
    res.send('Api Not Woking');
    // await seed();
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;