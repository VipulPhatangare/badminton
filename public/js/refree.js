// Dummy data for matches
const matches = [];
let isLive = false;
const completedMatches = [];
let liveMatchInfo = [];
// Scorecard state
let scorecardState = {
    maxPoints: 21,
    numberOfSets: 3,
    courtNumber: 2,
    currentSet: 1,
    player1Score: 0,
    player2Score: 0,
    player1Sets: 0,
    player2Sets: 0,
    sets: [],
    servingPlayer: 1, // 1 or 2
    firstServer: 1, // For alternating service at start of sets
    matchStarted: false,
    advantage: null, // null, 1, or 2
    gameOver: false
};

// Initialize DOM elements
const elements = {
    // Existing elements
    matchesContainer: document.getElementById('matches-container'),
    completedMatchesTable: document.getElementById('completed-matches-table'),
    matchTypeFilter: document.getElementById('match-type-filter'),
    searchInput: document.getElementById('search-matches'),
    startMatchModal: document.getElementById('start-match-modal'),
    confirmationModal: document.getElementById('confirmation-modal'),
    closeModalButtons: document.querySelectorAll('.close-modal'),
    confirmStartBtn: document.getElementById('confirm-start-btn'),
    cancelStartBtn: document.getElementById('cancel-start-btn'),
    finalStartBtn: document.getElementById('final-start-btn'),
    menuItems: document.querySelectorAll('.menu-item'),
    pages: document.querySelectorAll('.content > div'),
    goToScorecardBtn: document.getElementById('go-to-scorecard'),
    menuToggle: document.getElementById('menu-toggle'),
    sidebar: document.getElementById('sidebar'),
    overlay: document.getElementById('overlay'),
    mainContent: document.getElementById('main-content'),
    
    // Scorecard elements
    player1Increase: document.getElementById('player1-increase'),
    player1Decrease: document.getElementById('player1-decrease'),
    player2Increase: document.getElementById('player2-increase'),
    player2Decrease: document.getElementById('player2-decrease'),
    player1Score: document.getElementById('player1-score'),
    player2Score: document.getElementById('player2-score'),
    player1Service: document.getElementById('player1-service'),
    player2Service: document.getElementById('player2-service'),
    player1Card: document.getElementById('player1-card'),
    player2Card: document.getElementById('player2-card'),
    newSetBtn: document.getElementById('new-set-btn'),
    resetMatchBtn: document.getElementById('reset-match-btn'),
    scorecardCourt: document.getElementById('scorecard-court'),
    scorecardSets: document.getElementById('scorecard-sets'),
    scorecardPoints: document.getElementById('scorecard-points'),
    advantageMessage: document.getElementById('advantage-message'),
    setsTableBody: document.getElementById('sets-table-body')
};


async function takeMatchsInfo() {
    try {
        const response = await fetch('/refree/get-matches-info');
        const data = await response.json();
        console.log(data);   

        data.upcomingMatches.forEach(element => {
            matches.push(element);
        });

        data.completedMatches.forEach(element => {
            completedMatches.push(element);
        });
        
        const currentMatchSection = document.getElementById('currentMatchSection');
        const upcomingMatchesSection = document.getElementById('upcomingMatchesSection');
        if(data.liveMatches.length != 0){
            isLive = true;
            liveMatchInfo = data.liveMatches[0];
            upcomingMatchesSection.style.display = 'none';
            currentMatchSection.style.display = 'Block';
            let matchType = 'Team';
            if(data.liveMatches[0].matchType === 'Boys Singles' || data.liveMatches[0].matchType === 'Girls Singles'){
                matchType = 'Player';
            }
            currentMatchSection.innerHTML = `
                <div class="section-header">
                        <div class="section-title">Current Match</div>
                    </div>
                    <div class="match-card">
                        <div class="match-card-header">
                            <div class="match-number">${data.liveMatches[0].matchNo}</div>
                            <div class="match-type">${data.liveMatches[0].matchType}</div>
                        </div>
                        <div class="match-card-body">
                            <div class="match-players">
                                <div class="player">
                                    <span>${matchType} 1</span>
                                    <span>${data.liveMatches[0].playerName1 || data.liveMatches[0].teamName1 || 'N/A'}</span>
                                </div>
                                <div class="player">
                                    <span>${matchType} 2</span>
                                    <span>${data.liveMatches[0].isBye ? 'Bye' : (data.liveMatches[0].playerName2 || data.liveMatches[0].teamName2 || 'N/A')}</span>
                                </div>
                            </div>
                            <div class="match-details">
                                <div class="match-date">
                                    <i class="far fa-calendar"></i>
                                    <span>${data.liveMatches[0].date}, ${data.liveMatches[0].time}</span>
                                </div>
                                <div class="match-court">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${data.liveMatches[0].court}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section-actions" style="margin-top: 20px;">
                        <button class="go-btn" id="go-to-scorecard">
                            <i class="fas fa-play-circle"></i>
                            Go to Scorecard
                        </button>
                    </div>
            `;
            
            // Add event listener for the newly created button
            document.getElementById('go-to-scorecard').addEventListener('click', async () => {
                try {
                    // console.log(liveMatchInfo);
                    const response = await fetch('/refree/go-to-scorecard', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({matchType: liveMatchInfo.matchType, matchId: liveMatchInfo._id})
                    });

                    const data = await response.json();
                    if(data.success) {
                        window.location.href = '/scorecard';
                    } else {
                        alert(data.message || 'Failed to go to scorecard');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while trying to go to scorecard');
                }
            });

        }else{
            currentMatchSection.style.display = 'none';
            upcomingMatchesSection.style.display = 'Block';
        }
        

    } catch (error) {
        console.log(error);
    }
};


// Initialize the page
async function init() {

    await takeMatchsInfo();

    setupEventListeners(); // Set up listeners first
    renderMatches(); // Then render content
    renderCompletedMatches();
}

// Render matches based on filters
function renderMatches() {
    const typeValue = elements.matchTypeFilter ? elements.matchTypeFilter.value : 'all';
    const searchValue = elements.searchInput ? elements.searchInput.value.toLowerCase() : '';

    const filteredMatches = matches.filter(match => {
        // Check if match should be included based on type filter
        const typeMatch = typeValue === 'all' || match.matchType === typeValue;
        
        // Check if match should be included based on search value
        let searchMatch = false;
        if (searchValue) {
            // Check all possible searchable fields
            searchMatch = (
                (match.matchNo && match.matchNo.toString().toLowerCase().includes(searchValue)) ||
                (match.playerName1 && match.playerName1.toLowerCase().includes(searchValue)) ||
                (match.playerName2 && match.playerName2.toLowerCase().includes(searchValue)) ||
                (match.teamName1 && match.teamName1.toLowerCase().includes(searchValue)) ||
                (match.teamName2 && match.teamName2.toLowerCase().includes(searchValue))
            );
        } else {
            // If no search value, include all matches that match the type filter
            searchMatch = true;
        }
        
        return typeMatch && searchMatch;
    });

    if (elements.matchesContainer) {
        elements.matchesContainer.innerHTML = '';
    }
    
    if (filteredMatches.length === 0) {
        elements.matchesContainer.innerHTML = '<p>No matches found.</p>';
        return;
    }

    filteredMatches.forEach(match => {
        let matchType = 'Team';
        if(match.matchType === 'Boys Singles' || match.matchType === 'Girls Singles'){
            matchType = 'Player';
        }
        
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <div class="match-card-header">
                <div class="match-number">Match ${match.matchNo}</div>
                <div class="match-type">${match.matchType}</div>
            </div>
            <div class="match-card-body">
                <div class="match-players">
                    <div class="player">
                        <span>${matchType} 1</span>
                        <span>${match.playerName1 || match.teamName1 || 'N/A'}</span>
                    </div>
                    <div class="player">
                        <span>${matchType} 2</span>
                        <span>${match.isBye ? 'Bye' : (match.playerName2 || match.teamName2 || 'N/A')}</span>
                    </div>
                </div>
                <div class="match-details">
                    <div class="match-date">
                        <i class="far fa-calendar"></i>
                        <span>${match.date || 'N/A'}, ${match.time || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;

        matchCard.addEventListener('click', () => {
            openStartMatchModal(match);
        });

        elements.matchesContainer.appendChild(matchCard);
    });
}

// Render completed matches
function renderCompletedMatches() {
    elements.completedMatchesTable.innerHTML = '';
    
    completedMatches.forEach(match => {
        const row = document.createElement('tr');
        let player1 = '';
        let winner = '';
        console.log(match);
        if(match.playerName1){
            player1 = match.playerName1;
            if(match.winnerEmail == match.email1){
                winner = match.playerName1;
            }else{
                winner = match.playerName2;
            }
        }else{
            player1 = match.teamName1;

            if(match.winnerEmail == match.teamt1email1){
                winner = match.teamName1;
            }else{
                winner = match.teamName2;
            }
        }

        let player2 = '';
        if(match.playerName2){
            player2 = match.playerName2;
        }else{
            player2 = match.teamName2;
        }

        let score = '';
        for(let i = 0; i < match.set.length-1; i++){
            let element = match.set[i];
            score += `${element.player1Point}-${element.player2Point}, `;
        }
        score = score.replace(/,\s*$/, "");  
        row.innerHTML = `
            <td>${match.matchNo}</td>
            <td>${player1} vs ${player2}</td>
            <td>${winner}</td>
            <td>${score}</td>
            <td>${match.matchType}</td>
        `;
        elements.completedMatchesTable.appendChild(row);
    });
}

// Format match type for display
function formatMatchType(type) {
    return type.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Format date for display
function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Open start match modal
// Open start match modal with match details
function openStartMatchModal(match) {
    // Store the match ID
    document.getElementById('selected-match-id').value = match._id;
    console.log("Selected match ID:", match._id);
    
    // Set match number in title
    document.getElementById('modal-match-number').textContent = match.matchNo;
    
    // Display player/team information
    const playersInfoContainer = document.getElementById('match-players-info');
    let isSingles = match.matchType === 'Boys Singles' || match.matchType === 'Girls Singles';
    
    if (isSingles) {
        playersInfoContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 1.2rem; font-weight: 600;">${match.playerName1 || 'N/A'} vs ${match.isBye ? 'Bye' : (match.playerName2 || 'N/A')}</div>
                <div style="color: #7f8c8d; margin-top: 5px;">${match.matchType}</div>
            </div>
        `;
    } else {
        playersInfoContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 1.1rem; font-weight: 600;">${match.teamName1 || 'N/A'}</div>
                <div style="font-size: 0.9rem;">${match.teamt1player1 || 'N/A'}</div>
                <div style="font-size: 0.9rem; margin-bottom: 10px;">${match.teamt1player2|| 'N/A'}</div>
                
                <div style="font-size: 1.5rem; margin: 10px 0;">VS</div>
                
                <div style="font-size: 1.1rem; font-weight: 600;">${match.isBye ? 'Bye' : (match.teamName2 || 'N/A')}</div>
                ${!match.isBye ? `
                    <div style="font-size: 0.9rem;">${match.teamt2player1 || 'N/A'}</div>
                    <div style="font-size: 0.9rem;">${match.teamt2player2 || 'N/A'}</div>
                ` : ''}
                <div style="color: #7f8c8d; margin-top: 10px;">${match.matchType}</div>
            </div>
        `;
    }
    

    
    // Set court number to match's court
    document.getElementById('court-number').value = match.court || 1;
    
    // Populate first server options
    const firstServerSelect = document.getElementById('first-server');
    firstServerSelect.innerHTML = '';
    
    if (isSingles) {
        firstServerSelect.innerHTML = `
            <option value="${match.playerName1}">${match.playerName1 || 'Player 1'}</option>
            ${!match.isBye ? `<option value="${match.playerName2}">${match.playerName2 || 'Player 2'}</option>` : ''}
        `;
    } else {
        // For doubles matches, show team names
        firstServerSelect.innerHTML = `
            <option value="${match.teamName1}">${match.teamName1 || 'Team 1'}</option>
            ${!match.isBye ? `<option value="${match.teamName2}">${match.teamName2 || 'Team 2'}</option>` : ''}
        `;
    }
    
    // Show the modal
    elements.startMatchModal.classList.add('active');
    
    // Store the current match in the confirm button
    elements.confirmStartBtn.dataset.matchId = match._id;
}


function updateConfirmationModal(match, settings) {
    const isSingles = match.matchType === 'Boys Singles' || match.matchType === 'Girls Singles';
    const serverName = settings.firstServer;
    
    document.getElementById('confirmation-details').innerHTML = `
        <p><strong>Match:</strong> #${match.matchNo} - ${match.matchType}</p>
        <p><strong>Players:</strong> ${isSingles ? 
            `${match.playerName1} vs ${match.isBye ? 'Bye' : match.playerName2}` : 
            `${match.teamName1} vs ${match.isBye ? 'Bye' : match.teamName2}`}</p>
        <p><strong>Max Points:</strong> ${settings.maxPoints}</p>
        <p><strong>Number of Sets:</strong> ${settings.numberOfSets}</p>
        <p><strong>Court:</strong> ${settings.courtNumber}</p>
        <p><strong>First Server:</strong> ${serverName}</p>
    `;
}


// Start the match with the selected settings
function startMatch(settings) {
    scorecardState.maxPoints = parseInt(settings.maxPoints);
    scorecardState.numberOfSets = parseInt(settings.numberOfSets);
    scorecardState.courtNumber = parseInt(settings.courtNumber);
    scorecardState.firstServer = parseInt(settings.firstServer);
    scorecardState.servingPlayer = parseInt(settings.firstServer);
    scorecardState.matchStarted = true;
    scorecardState.gameOver = false;
    
    // Reset scores
    scorecardState.currentSet = 1;
    scorecardState.player1Score = 0;
    scorecardState.player2Score = 0;
    scorecardState.player1Sets = 0;
    scorecardState.player2Sets = 0;
    scorecardState.sets = [];
    scorecardState.advantage = null;
    
    // Update scorecard display
    elements.scorecardCourt.textContent = scorecardState.courtNumber;
    elements.scorecardSets.textContent = scorecardState.numberOfSets;
    elements.scorecardPoints.textContent = scorecardState.maxPoints;
    elements.player1Score.textContent = '0';
    elements.player2Score.textContent = '0';
    
    // Update service indicator
    updateServiceIndicator();
    
    // Clear sets table
    elements.setsTableBody.innerHTML = '';
    
    // Hide new set button
    elements.newSetBtn.style.display = 'none';
    
    // Show scorecard page
    showPage('scorecard-page');
}

// Update the service indicator
function updateServiceIndicator() {
    if (scorecardState.servingPlayer === 1) {
        elements.player1Service.style.display = 'block';
        elements.player2Service.style.display = 'none';
        elements.player1Card.classList.add('active');
        elements.player2Card.classList.remove('active');
    } else {
        elements.player1Service.style.display = 'none';
        elements.player2Service.style.display = 'block';
        elements.player1Card.classList.remove('active');
        elements.player2Card.classList.add('active');
    }
}

// Update the advantage message
function updateAdvantageMessage() {
    if (scorecardState.advantage === 1) {
        elements.advantageMessage.textContent = 'Advantage John Smith';
        elements.advantageMessage.style.display = 'block';
    } else if (scorecardState.advantage === 2) {
        elements.advantageMessage.textContent = 'Advantage Mike Johnson';
        elements.advantageMessage.style.display = 'block';
    } else {
        elements.advantageMessage.style.display = 'none';
    }
}

// Check if a set has been won
function checkSetWin() {
    const p1Score = scorecardState.player1Score;
    const p2Score = scorecardState.player2Score;
    const maxPoints = scorecardState.maxPoints;
    
    // Check for normal win condition
    if ((p1Score >= maxPoints || p2Score >= maxPoints) && Math.abs(p1Score - p2Score) >= 2) {
        return p1Score > p2Score ? 1 : 2;
    }
    
    // Check for advantage situation
    if (p1Score >= maxPoints - 1 && p2Score >= maxPoints - 1) {
        if (Math.abs(p1Score - p2Score) === 1) {
            scorecardState.advantage = p1Score > p2Score ? 1 : 2;
            updateAdvantageMessage();
        } else if (Math.abs(p1Score - p2Score) === 0) {
            scorecardState.advantage = null;
            updateAdvantageMessage();
        }
        
        // If lead is 2 points after deuce, set is won
        if (Math.abs(p1Score - p2Score) >= 2) {
            return p1Score > p2Score ? 1 : 2;
        }
    }
    
    return 0;
}

// Award a set to a player
function awardSet(winner) {
    if (winner === 1) {
        scorecardState.player1Sets++;
    } else {
        scorecardState.player2Sets++;
    }
    
    // Record the set result
    scorecardState.sets.push({
        set: scorecardState.currentSet,
        player1: scorecardState.player1Score,
        player2: scorecardState.player2Score,
        winner: winner
    });
    
    // Update sets table
    updateSetsTable();
    
    // Check if match is over
    const setsToWin = Math.ceil(scorecardState.numberOfSets / 2);
    if (scorecardState.player1Sets >= setsToWin || scorecardState.player2Sets >= setsToWin) {
        endMatch();
    } else {
        // Show new set button
        elements.newSetBtn.style.display = 'block';
    }
}

// Update the sets table
function updateSetsTable() {
    elements.setsTableBody.innerHTML = '';
    
    scorecardState.sets.forEach(set => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${set.set}</td>
            <td>${set.player1}</td>
            <td>${set.player2}</td>
            <td>${set.winner === 1 ? 'John Smith' : 'Mike Johnson'}</td>
        `;
        elements.setsTableBody.appendChild(row);
    });
}

// Start a new set
function startNewSet() {
    scorecardState.currentSet++;
    scorecardState.player1Score = 0;
    scorecardState.player2Score = 0;
    scorecardState.advantage = null;
    
    // Alternate the first server for the new set
    scorecardState.firstServer = scorecardState.firstServer === 1 ? 2 : 1;
    scorecardState.servingPlayer = scorecardState.firstServer;
    
    // Update display
    elements.player1Score.textContent = '0';
    elements.player2Score.textContent = '0';
    updateServiceIndicator();
    updateAdvantageMessage();
    
    // Hide new set button
    elements.newSetBtn.style.display = 'none';
}

// End the match
function endMatch() {
    scorecardState.gameOver = true;
    elements.advantageMessage.textContent = `Match won by ${scorecardState.player1Sets > scorecardState.player2Sets ? 'John Smith' : 'Mike Johnson'}!`;
    elements.advantageMessage.style.backgroundColor = '#d4edda';
    elements.advantageMessage.style.display = 'block';
    
    // Show the new set button to allow resetting
    elements.newSetBtn.style.display = 'none';
}

// Reset the match
function resetMatch() {
    if (confirm('Are you sure you want to end this match?')) {
        scorecardState.matchStarted = false;
        scorecardState.gameOver = false;
        
        // Show dashboard page
        showPage('dashboard-page');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter event listeners
    if (elements.matchTypeFilter) {
        elements.matchTypeFilter.addEventListener('change', renderMatches);
    }
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', renderMatches);
    }

    // Menu toggle for mobile
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', () => {
            elements.sidebar.classList.toggle('active');
            elements.mainContent.classList.toggle('sidebar-active');
            elements.overlay.classList.toggle('active');
        });
    }

    // Close sidebar when clicking on overlay
    if (elements.overlay) {
        elements.overlay.addEventListener('click', () => {
            elements.sidebar.classList.remove('active');
            elements.mainContent.classList.remove('sidebar-active');
            elements.overlay.classList.remove('active');
        });
    }

    // Close modal buttons
    if (elements.closeModalButtons) {
        elements.closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                elements.startMatchModal.classList.remove('active');
                elements.confirmationModal.classList.remove('active');
            });
        });
    }

    // Confirm start match

    if (elements.confirmStartBtn) {
        elements.confirmStartBtn.addEventListener('click', () => {
            const maxPoints = document.getElementById('max-points').value;
            const numberOfSets = document.getElementById('number-of-sets').value;
            const courtNumber = document.getElementById('court-number').value;
            const firstServer = document.getElementById('first-server').value;
            const matchId = document.getElementById('selected-match-id').value;
            
            // Find the match
            const match = matches.find(m => m._id === matchId);
            let matchType = match.matchType;
            // Populate confirmation details
            updateConfirmationModal(match, {
                maxPoints,
                numberOfSets,
                courtNumber,
                firstServer
            });
            
            // Show confirmation modal
            elements.startMatchModal.classList.remove('active');
            elements.confirmationModal.classList.add('active');
            
            // Store settings in the final start button
            elements.finalStartBtn.dataset.settings = JSON.stringify({
                maxPoints,
                numberOfSets,
                courtNumber,
                firstServer,
                matchId,
                matchType
            });
        });
    }

    // Cancel start match
    if (elements.cancelStartBtn) {
        elements.cancelStartBtn.addEventListener('click', () => {
            elements.confirmationModal.classList.remove('active');
            elements.startMatchModal.classList.add('active');
        });
    }

    // Final start match confirmation
    if (elements.finalStartBtn) {
        elements.finalStartBtn.addEventListener('click', async() => {
            const settings = JSON.parse(elements.finalStartBtn.dataset.settings);
            
            console.log(settings);    

            const response = await fetch('/refree/start-match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            const data = await response.json();
            if(data.success){
                window.location.href = '/scorecard';
            }else{
                alert(data.message);
            }
        });
    }

    // Menu item clicks
    elements.menuItems.forEach(item => {
        item.addEventListener('click',async function() {
            if (this.id === 'logout-btn') {
                if (confirm('Are you sure you want to log out?')) {
                    const response = await fetch('/auth/logout');
                    const data = await response.json();
                    if(data.success){
                        window.location.href = '/';
                    }else{
                        alert(data.message);
                    }
                }
                return;
            }
            
            const pageId = this.dataset.page;
            if (pageId) {
                if (pageId === 'dashboard') {
                    showPage('dashboard-page');
                } else if (pageId === 'completed-matches') {
                    showPage('completed-matches-page');
                }
            }
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                elements.sidebar.classList.remove('active');
                elements.overlay.classList.remove('active');
                elements.mainContent.classList.remove('sidebar-active');
            }
        });
    });

    // Go to scorecard button is now handled when the button is created

    // Score control buttons - only add if elements exist
    if (elements.player1Increase) {
        elements.player1Increase.addEventListener('click', () => {
            if (!scorecardState.gameOver && scorecardState.matchStarted) {
                scorecardState.player1Score++;
                elements.player1Score.textContent = scorecardState.player1Score;
                
                // Switch service to the other player when a point is scored
                scorecardState.servingPlayer = 2;
                updateServiceIndicator();
                
                // Check if set is won
                const setWinner = checkSetWin();
                if (setWinner > 0) {
                    awardSet(setWinner);
                }
            }
        });
    }

    if (elements.player1Decrease) {
        elements.player1Decrease.addEventListener('click', () => {
            if (scorecardState.player1Score > 0 && !scorecardState.gameOver && scorecardState.matchStarted) {
                scorecardState.player1Score--;
                elements.player1Score.textContent = scorecardState.player1Score;
                
                // Check advantage
                if (scorecardState.player1Score >= scorecardState.maxPoints - 1 && 
                    scorecardState.player2Score >= scorecardState.maxPoints - 1) {
                    if (Math.abs(scorecardState.player1Score - scorecardState.player2Score) === 1) {
                        scorecardState.advantage = scorecardState.player1Score > scorecardState.player2Score ? 1 : 2;
                    } else if (scorecardState.player1Score === scorecardState.player2Score) {
                        scorecardState.advantage = null;
                    }
                } else {
                    scorecardState.advantage = null;
                }
                
                updateAdvantageMessage();
            }
        });
    }

    if (elements.player2Increase) {
        elements.player2Increase.addEventListener('click', () => {
            if (!scorecardState.gameOver && scorecardState.matchStarted) {
                scorecardState.player2Score++;
                elements.player2Score.textContent = scorecardState.player2Score;
                
                // Switch service to the other player when a point is scored
                scorecardState.servingPlayer = 1;
                updateServiceIndicator();
                
                // Check if set is won
                const setWinner = checkSetWin();
                if (setWinner > 0) {
                    awardSet(setWinner);
                }
            }
        });
    }

    if (elements.player2Decrease) {
        elements.player2Decrease.addEventListener('click', () => {
            if (scorecardState.player2Score > 0 && !scorecardState.gameOver && scorecardState.matchStarted) {
                scorecardState.player2Score--;
                elements.player2Score.textContent = scorecardState.player2Score;
                
                // Check advantage
                if (scorecardState.player1Score >= scorecardState.maxPoints - 1 && 
                    scorecardState.player2Score >= scorecardState.maxPoints - 1) {
                    if (Math.abs(scorecardState.player1Score - scorecardState.player2Score) === 1) {
                        scorecardState.advantage = scorecardState.player1Score > scorecardState.player2Score ? 1 : 2;
                    } else if (scorecardState.player1Score === scorecardState.player2Score) {
                        scorecardState.advantage = null;
                    }
                } else {
                    scorecardState.advantage = null;
                }
                
                updateAdvantageMessage();
            }
        });
    }

    // New set button
    if (elements.newSetBtn) {
        elements.newSetBtn.addEventListener('click', startNewSet);
    }

    // Reset match button
    if (elements.resetMatchBtn) {
        elements.resetMatchBtn.addEventListener('click', resetMatch);
    }
}

// Show specific page and hide others
function showPage(pageId) {
    elements.pages.forEach(page => {
        page.style.display = page.id === pageId ? 'block' : 'none';
    });
}


document.addEventListener('DOMContentLoaded', async()=>{
    await init();
});