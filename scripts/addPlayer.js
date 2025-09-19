async function seed() {
  try {
   
    const players = [];

    // 32 boys
    for (let i = 1; i <= 32; i++) {
      players.push({
        name: `Boy${i}`,
        gender: "Male",
        password: "123456",
        phone: `90000000${i.toString().padStart(2, "0")}`,
        email: `boy${i}.vipul.phanagare23@pccoepune.org`,
        prn: `PRNBOY${i}`,
        year: "SE",
        branch: "CSE",
        doubles: true,
        singles: true,
      });
    }

    // 32 girls
    for (let i = 1; i <= 32; i++) {
      players.push({
        name: `Girl${i}`,
        gender: "Female",
        password: "123456",
        phone: `80000000${i.toString().padStart(2, "0")}`,
        email: `girl${i}.vipul.phanagare23@pccoepune.org`,
        prn: `PRNGIRL${i}`,
        year: "SE",
        branch: "CSE",
        doubles: true,
        singles: true,
      });
    }

    // Insert players
    await PlayerInfo.insertMany(players);
    console.log("👤 Players inserted:", players.length);

    // Register Singles
    const singles = players.map((p) => ({
      email: p.email,
      gender: p.gender,
    }));
    await RegisterSingles.insertMany(singles);
    console.log("🏸 Singles registered:", singles.length);

    // Register Doubles (pairing every 2 players of same gender)
    const doubles = [];
    // Boys
    for (let i = 0; i < 32; i += 2) {
      doubles.push({
        teamName: `Team_Boy${i / 2 + 1}`,
        email1: players[i].email,
        email2: players[i + 1].email,
        gender: "Male",
      });
    }
    // Girls
    for (let i = 32; i < 64; i += 2) {
      doubles.push({
        teamName: `Team_Girl${(i - 32) / 2 + 1}`,
        email1: players[i].email,
        email2: players[i + 1].email,
        gender: "Female",
      });
    }

    await RegisterDoubles.insertMany(doubles);
    console.log("👯 Doubles registered:", doubles.length);

    console.log("✅ Dummy data inserted successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
  }
}
