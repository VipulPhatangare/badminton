// Initialize variables
let matchCount;
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
// Update dropdown based on singles/doubles selection
function updateDropdownOptions() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    
    // Clear existing options
    player1Select.innerHTML = '';
    player2Select.innerHTML = '';
    
    // Add empty option as first choice
    const emptyOption1 = document.createElement('option');
    emptyOption1.value = '';
    emptyOption1.textContent = '-- Select --';
    player1Select.appendChild(emptyOption1);

    const emptyOption2 = document.createElement('option');
    emptyOption2.value = '';
    emptyOption2.textContent = '-- Select Player 1 First --';
    player2Select.appendChild(emptyOption2);
    
    if (isSingles) {
        // Add players to player1 dropdown only (filter out allocated players)
        playersData.forEach(player => {
            if(!player.isAllocated){
                const option = document.createElement('option');
                option.value = player._id;
                option.textContent = `${player.player[0].name} (${player.player[0].prn})`;
                player1Select.appendChild(option);
            }
        });
    } else {
        // Add teams to player1 dropdown only (filter out allocated teams)
        teamsData.forEach(team => {
            if(!team.isAllocated){
                const option = document.createElement('option');
                option.value = team._id;
                option.textContent = `${team.teamName}: ${team.player1[0].name} & ${team.player2[0].name}`;
                player1Select.appendChild(option);
            }
        });
    }
    
    // Disable player2 select initially
    player2Select.disabled = true;
}

function updatePlayer2Options() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    const selectedValue = player1Select.value;
    
    // Clear player2 dropdown
    player2Select.innerHTML = '';
    
    // If no player1 is selected, disable player2 dropdown
    if (!selectedValue) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Player 1 First --';
        player2Select.appendChild(emptyOption);
        player2Select.disabled = true;
        return;
    }
    
    // Enable player2 dropdown
    player2Select.disabled = false;
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select --';
    player2Select.appendChild(defaultOption);
    
    if (isSingles) {
        // Add all players except the selected one in player1 (filter out allocated players)
        playersData.forEach(player => {
            if (!player.isAllocated && player._id !== selectedValue) {
                const option = document.createElement('option');
                option.value = player._id;
                option.textContent = `${player.player[0].name} (${player.player[0].prn})`;
                player2Select.appendChild(option);
            }
        });
    } else {
        // Add all teams except the selected one in player1 (filter out allocated teams)
        teamsData.forEach(team => {
            if (!team.isAllocated && team._id !== selectedValue) {
                const option = document.createElement('option');
                option.value = team._id;
                option.textContent = `${team.teamName}: ${team.player1[0].name} & ${team.player2[0].name}`;
                player2Select.appendChild(option);
            }
        });
    }
    
    // Add "Bye" option to player2 dropdown
    const byeOption = document.createElement('option');
    byeOption.value = 'bye';
    byeOption.textContent = 'BYE';
    player2Select.appendChild(byeOption);
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
        showToast('Please select players/teams for both sides', 'error');
        return;
    }
    
    // Get selected values
    let matchType;
    if(typeOfMatch == 'BS'){
        matchType = 'Boys Singles';
    }else if(typeOfMatch == 'GS'){
        matchType = 'Girls Singles';
    }else if(typeOfMatch == 'BD'){
        matchType = 'Boys Doubles';
    }else{
        matchType = 'Girls Doubles';
    }
    let player1Info, player2Info;
    
    if (isSingles) {
        const player1 = playersData.find(p => p._id == player1Select.value);
        player1Info = `${player1.player[0].name} (${player1.player[0].prn})`;
        
        if (player2Select.value === 'bye') {
            player2Info = 'BYE';
        } else {
            const player2 = playersData.find(p => p._id == player2Select.value);
            player2Info = `${player2.player[0].name} (${player2.player[0].prn})`;
        }
    } else {
        const team1 = teamsData.find(t => t._id == player1Select.value);
        player1Info = `${team1.teamName}: ${team1.player1[0].name} (${team1.player1[0].prn}) & ${team1.player2[0].name} (${team1.player2[0].prn})`;
        
        if (player2Select.value === 'bye') {
            player2Info = 'BYE';
        } else {
            const team2 = teamsData.find(t => t._id == player2Select.value);
            player2Info = `${team2.teamName}: ${team2.player1[0].name} (${team2.player1[0].prn}) & ${team2.player2[0].name} (${team2.player2[0].prn})`;
        }
    }
    
    const date = dateSelect.value;
    const time = timeSelect.value;
    const round = roundSelect.value;

    let playerOrTeam = 'Player';
    if(!isSingles){
        playerOrTeam = 'Team'
    }
    
    // Populate confirmation details
    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = `
        <div class="confirmation-item">
            <span class="confirmation-label">Match Type:</span>
            <span>${matchType}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">${playerOrTeam} 1:</span>
            <span>${player1Info}</span>
        </div>
        <div class="confirmation-item">
            <span class="confirmation-label">${playerOrTeam} 2:</span>
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
async function confirmMatch() {
    try {
        const player1Select = document.getElementById('player1');
        const player2Select = document.getElementById('player2');
        const dateSelect = document.getElementById('matchDate');
        const timeSelect = document.getElementById('matchTime');
        const roundSelect = document.getElementById('round');
        
        // Get selected values
        let matchType;
        if(typeOfMatch == 'BS'){
            matchType = 'Boys Singles';
        }else if(typeOfMatch == 'GS'){
            matchType = 'Girls Singles';
        }else if(typeOfMatch == 'BD'){
            matchType = 'Boys Doubles';
        }else{
            matchType = 'Girls Doubles';
        }

        

        const match = {};
        
        if (isSingles) {
            const player1 = playersData.find(p => p._id == player1Select.value);
            player1.isAllocated = true;
            match.email1 = player1.player[0].email;
            match.playerName1 = player1.player[0].name;
            
            if (player2Select.value === 'bye') {
                match.email2 = '';
                match.playerName2 = 'BYE';
                match.isBye = true;
            } else {
                const player2 = playersData.find(p => p._id == player2Select.value);

                match.email2 = player2.player[0].email;
                match.playerName2 = player2.player[0].name;
                match.isBye = false;
                
            }


        } else {
            const team1 = teamsData.find(t => t._id == player1Select.value);
            
            match.teamName1 = team1.teamName;
            match.teamt1email1 = team1.player1[0].email;
            match.teamt1email2 = team1.player2[0].email;
            
            if (player2Select.value === 'bye') {
                match.teamName2 = 'Bye';
                match.teamt2email1 = '';
                match.teamt2email2 = '';
                match.isBye = true;
            } else {
                const team2 = teamsData.find(t => t._id == player2Select.value);
                match.teamName2 = team2.teamName;
                match.teamt2email1 = team2.player1[0].email;
                match.teamt2email2 = team2.player2[0].email;
                match.isBye = false;
                
            }


        }
        
        const date = dateSelect.value;
        const time = timeSelect.value;
        const round = roundSelect.value;
        let matchNumber = typeOfMatch+  `_${matchCount+1}`;

        match.matchType = matchType;
        match.date = date;
        match.time = time;
        match.matchType = matchType;
        match.round = round;
        match.matchNo = matchNumber;
        match.status = 'Upcomming';
        match.isComplete = false;

        
        const response = await fetch("/shedule/allocate-match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({match, typeOfMatch}),
        });

        const data = await response.json();
        if(data.success){
            showToast(data.message, 'success');

            matchCount++;

            if (isSingles) {
                // Mark players as allocated
                const player1 = playersData.find(p => p._id == player1Select.value);
                player1.isAllocated = true;
                
                if (player2Select.value !== 'bye') {
                    const player2 = playersData.find(p => p._id == player2Select.value);
                    player2.isAllocated = true;
                }
            } else {
                // Mark teams as allocated
                const team1 = teamsData.find(t => t._id == player1Select.value);
                team1.isAllocated = true;
                
                if (player2Select.value !== 'bye') {
                    const team2 = teamsData.find(t => t._id == player2Select.value);
                    team2.isAllocated = true;
                }
            }

            allocatedMatches.push(match);
        
            updateMatchNumber();
            renderAllocatedMatches();
            
            // Reset form
            player1Select.selectedIndex = 0;
            player2Select.selectedIndex = 0;
            updatePlayer2Options();
            
            // Close modal
            closeModal();
            location.reload();

        }else{
            showToast(data.message, 'error');
        }
        
    } catch (error) {
        console.log(error);
        showToast('An error occurred while processing your request', 'error');
    }
}

// Update match number display
function updateMatchNumber() {
    document.getElementById('matchNumber').textContent = `${typeOfMatch}_${matchCount + 1}`;
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
        
        if (isSingles) {
            player1Details = `${match.playerName1}`;
            player2Details = match.isBye
                ? 'BYE' 
                : `${match.playerName2}`;
        } else {
            player1Details = `${match.teamName1}`;
            player2Details = match.isBye
                ? 'BYE' 
                : `${match.teamName2}`;
        }
        
        matchCard.innerHTML = `
            <div class="match-card-header">
                <span class="match-type">${match.matchType} - Match ${match.matchNo}</span>
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
            console.log(playersData);

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

        const response1 = await fetch("/shedule/allocated-matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({typeOfMatch, gender}),
        });

        if(isSingles){
            document.getElementById('player1OrTeam1Name').innerText = 'Player 1:';
            document.getElementById('player2OrTeam2Name').innerText = 'Player 2:';
        }else{
            document.getElementById('player1OrTeam1Name').innerText = 'Team 1:';
            document.getElementById('player2OrTeam2Name').innerText = 'Team 2:';
        }

        allocatedMatches = await response1.json();

        const response2 = await fetch('/shedule/match-counter');
        const data2 = await response2.json();
        console.log(data2);
        if(typeOfMatch == 'BS' || typeOfMatch == 'GS'){
            if(gender == 'Male'){
                matchCount = data2[0].singlesBoysMatchesCount;
                document.getElementById('chageTitle').innerText = 'Boys Singles Match Allocation';
            }else{
                matchCount = data2[0].singlesGirlsMatchesCount;
                document.getElementById('chageTitle').innerText = 'Girls Singles Match Allocation';
            }
        }else{
            if(gender == 'Male'){
                matchCount = data2[0].doublesBoysMatchesCount;
                document.getElementById('chageTitle').innerText = 'Boys Doubles Match Allocation';
            }else{
                matchCount = data2[0].doublesGirlsMatchesCount;
                document.getElementById('chageTitle').innerText = 'Girls Doubles Match Allocation';
            }
        }
        // matchCount = allocatedMatches.length;


        updateMatchNumber();
        generateTimeSlots();
        // createDummyData();
        updateDropdownOptions();
        renderAllocatedMatches();
    } catch (error) {
        console.log(error);
    }
}


function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

document.addEventListener("DOMContentLoaded", async function () {
    await init();
    
    // Add event listener for player1 changes
    document.getElementById('player1').addEventListener('change', updatePlayer2Options);
});
