// Initialize variables
let matchCount = 4;
let isSingles = true;
let playersData = [];
let teamsData = [];
let allocatedMatches = [];

// Generate time slots from 9am to 8pm
function generateTimeSlots() {
    const timeSelect = document.getElementById('matchTime');
    timeSelect.innerHTML = '';
    
    for (let hour = 9; hour <= 20; hour++) {
        const period = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:00 ${period}`;
        
        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        timeSelect.appendChild(option);
    }
}

// Create dummy data for players and teams
function createDummyData() {
    // Create players
    for (let i = 1; i <= 16; i++) {
        playersData.push({
            id: i,
            name: `Player ${i}`,
            prn: `PRN${1000 + i}`,
            email: `player${i}@example.com`
        });
    }
    
    // Create teams (pairs of players)
    for (let i = 1; i <= 8; i++) {
        const player1 = playersData[i * 2 - 2];
        const player2 = playersData[i * 2 - 1];
        
        teamsData.push({
            id: i,
            name: `Team ${i}`,
            player1: player1,
            player2: player2
        });
    }
}

// Update dropdown based on singles/doubles selection
function updateDropdownOptions() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    
    // Clear existing options
    player1Select.innerHTML = '';
    player2Select.innerHTML = '';
    
    if (isSingles) {
        // Add players to dropdown
        playersData.forEach(player => {
            const option1 = document.createElement('option');
            option1.value = player.id;
            option1.textContent = `${player.name} (${player.prn})`;
            player1Select.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = player.id;
            option2.textContent = `${player.name} (${player.prn})`;
            player2Select.appendChild(option2);
        });
    } else {
        // Add teams to dropdown
        teamsData.forEach(team => {
            const option1 = document.createElement('option');
            option1.value = team.id;
            option1.textContent = `${team.name}: ${team.player1.name} & ${team.player2.name}`;
            player1Select.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = team.id;
            option2.textContent = `${team.name}: ${team.player1.name} & ${team.player2.name}`;
            player2Select.appendChild(option2);
        });
    }
    
    // Add "Bye" option to player2 dropdown
    const byeOption = document.createElement('option');
    byeOption.value = 'bye';
    byeOption.textContent = 'BYE';
    player2Select.appendChild(byeOption);
    
    // Initialize player2 options
    updatePlayer2Options();
}

// Update player2 dropdown based on player1 selection
function updatePlayer2Options() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    const selectedValue = player1Select.value;
    
    // Enable all options first
    for (let i = 0; i < player2Select.options.length; i++) {
        player2Select.options[i].disabled = false;
    }
    
    // Disable the selected player1 option in player2 dropdown
    if (selectedValue && selectedValue !== 'bye') {
        for (let i = 0; i < player2Select.options.length; i++) {
            if (player2Select.options[i].value === selectedValue) {
                player2Select.options[i].disabled = true;
                break;
            }
        }
    }
}

// Show confirmation modal
function showConfirmation() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    const dateSelect = document.getElementById('matchDate');
    const timeSelect = document.getElementById('matchTime');
    const roundSelect = document.getElementById('round');
    
    // Validate form
    if (!player1Select.value || !player2Select.value) {
        alert('Please select players/teams for both sides');
        return;
    }
    
    // Get selected values
    const matchType = isSingles ? 'Singles' : 'Doubles';
    let player1Info, player2Info;
    
    if (isSingles) {
        const player1 = playersData.find(p => p.id == player1Select.value);
        player1Info = `${player1.name} (${player1.prn})`;
        
        if (player2Select.value === 'bye') {
            player2Info = 'BYE';
        } else {
            const player2 = playersData.find(p => p.id == player2Select.value);
            player2Info = `${player2.name} (${player2.prn})`;
        }
    } else {
        const team1 = teamsData.find(t => t.id == player1Select.value);
        player1Info = `${team1.name}: ${team1.player1.name} (${team1.player1.prn}) & ${team1.player2.name} (${team1.player2.prn})`;
        
        if (player2Select.value === 'bye') {
            player2Info = 'BYE';
        } else {
            const team2 = teamsData.find(t => t.id == player2Select.value);
            player2Info = `${team2.name}: ${team2.player1.name} (${team2.player1.prn}) & ${team2.player2.name} (${team2.player2.prn})`;
        }
    }
    
    const date = dateSelect.value;
    const time = timeSelect.value;
    const round = roundSelect.value;
    
    // Populate confirmation details
    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = `
        <div class="confirmation-item">
            <span class="confirmation-label">Match Type:</span>
            <span>${matchType}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Player 1/Team 1:</span>
            <span>${player1Info}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Player 2/Team 2:</span>
            <span>${player2Info}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Date:</span>
            <span>${date}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Time:</span>
            <span>${time}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">Round:</span>
            <span>${round}</span>
        </div>
    `;
    
    // Show modal
    document.getElementById('confirmationModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

// Confirm match and add to allocated matches
function confirmMatch() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    const dateSelect = document.getElementById('matchDate');
    const timeSelect = document.getElementById('matchTime');
    const roundSelect = document.getElementById('round');
    
    // Get selected values
    const matchType = isSingles ? 'Singles' : 'Doubles';
    let player1Info, player2Info;
    
    if (isSingles) {
        const player1 = playersData.find(p => p.id == player1Select.value);
        player1Info = {
            type: 'player',
            id: player1.id,
            name: player1.name,
            prn: player1.prn
        };
        
        if (player2Select.value === 'bye') {
            player2Info = {
                type: 'bye',
                name: 'BYE'
            };
        } else {
            const player2 = playersData.find(p => p.id == player2Select.value);
            player2Info = {
                type: 'player',
                id: player2.id,
                name: player2.name,
                prn: player2.prn
            };
        }
    } else {
        const team1 = teamsData.find(t => t.id == player1Select.value);
        player1Info = {
            type: 'team',
            id: team1.id,
            name: team1.name,
            players: [
                { name: team1.player1.name, prn: team1.player1.prn },
                { name: team1.player2.name, prn: team1.player2.prn }
            ]
        };
        
        if (player2Select.value === 'bye') {
            player2Info = {
                type: 'bye',
                name: 'BYE'
            };
        } else {
            const team2 = teamsData.find(t => t.id == player2Select.value);
            player2Info = {
                type: 'team',
                id: team2.id,
                name: team2.name,
                players: [
                    { name: team2.player1.name, prn: team2.player1.prn },
                    { name: team2.player2.name, prn: team2.player2.prn }
                ]
            };
        }
    }
    
    const date = dateSelect.value;
    const time = timeSelect.value;
    const round = roundSelect.value;
    
    // Create match object
    const match = {
        id: allocatedMatches.length + 1,
        matchNumber: ++matchCount,
        type: matchType,
        player1: player1Info,
        player2: player2Info,
        date: date,
        time: time,
        round: round
    };
    
    // Add to allocated matches
    allocatedMatches.push(match);
    
    // Update UI
    updateMatchNumber();
    renderAllocatedMatches();
    
    // Reset form
    player1Select.selectedIndex = 0;
    player2Select.selectedIndex = 0;
    updatePlayer2Options();
    
    // Close modal
    closeModal();
}

// Update match number display
function updateMatchNumber() {
    document.getElementById('matchNumber').textContent = matchCount + 1;
}

// Render allocated matches
function renderAllocatedMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    
    if (allocatedMatches.length === 0) {
        matchesList.innerHTML = '<p>No matches allocated yet.</p>';
        return;
    }
    
    allocatedMatches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        let player1Details, player2Details;
        
        if (match.type === 'Singles') {
            player1Details = `${match.player1.name} (${match.player1.prn})`;
            player2Details = match.player2.type === 'bye' 
                ? 'BYE' 
                : `${match.player2.name} (${match.player2.prn})`;
        } else {
            player1Details = `${match.player1.name}: ${match.player1.players[0].name} (${match.player1.players[0].prn}) & ${match.player1.players[1].name} (${match.player1.players[1].prn})`;
            player2Details = match.player2.type === 'bye' 
                ? 'BYE' 
                : `${match.player2.name}: ${match.player2.players[0].name} (${match.player2.players[0].prn}) & ${match.player2.players[1].name} (${match.player2.players[1].prn})`;
        }
        
        matchCard.innerHTML = `
            <div class="match-card-header">
                <span class="match-type">${match.type} - Match ${match.matchNumber}</span>
                <span>${match.round}</span>
            </div>
            <div class="match-players">
                <div>${player1Details}</div>
                <div class="vs-text">VS</div>
                <div>${player2Details}</div>
            </div>
            <div class="match-detail">
                <span>${match.date}</span>
                <span>${match.time}</span>
            </div>
        `;
        
        matchesList.appendChild(matchCard);
    });
}

// Initialize the page
async function init() {
    try {

        let gender = 'Female';
        if(typeOfMatch == 'BS' || typeOfMatch == 'BD'){
            gender = 'Male';
        }

        if(typeOfMatch == 'BS' || typeOfMatch == 'GS'){
            isSingles = true;
            const response = await fetch("/shedule/player-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({gender}),
            });
            
            playersData = await response.json();
            // console.log(playersData);

        }else{
            isSingles = false;
            const response = await fetch("/shedule/team-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({gender}),
            });

            teamsData = await response.json();
            console.log(teamsData);
        }

        generateTimeSlots();
        createDummyData();
        updateDropdownOptions();
        renderAllocatedMatches();
    } catch (error) {
        console.log(error);
    }
}



document.addEventListener("DOMContentLoaded", async function () {
    await init();
});


