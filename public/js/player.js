const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');
const closeNav = document.querySelector('.close-nav');
const logoutBtn = document.querySelectorAll('.logout-btn');
const registrationPrompt = document.getElementById('registrationPrompt');
const matchesSection = document.getElementById('matchesSection');
const matchesContainer = document.getElementById('matchesContainer');
const noMatchesMessage = document.getElementById('noMatchesMessage');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');
const profileSection = document.getElementById('profileSection');
const registrationStatus = document.getElementById('registrationStatus');
const registerButtons = document.getElementById('registerButtons');
const pageTitle = document.getElementById('pageTitle');
const matchesSectionTitle = document.getElementById('matchesSectionTitle');
const navHome = document.querySelectorAll('.nav-home');

let currentView = 'upcoming'; // 'upcoming' or 'completed'
const viewUpcoming = document.getElementById('viewUpcoming');
const viewCompleted = document.getElementById('viewCompleted');
const noUpcomingMatches = document.getElementById('noUpcomingMatches');
const noCompletedMatches = document.getElementById('noCompletedMatches');

// Modal elements
const singlesModal = document.getElementById('singlesModal');
const doublesModal = document.getElementById('doublesModal');
const successModal = document.getElementById('successModal');
const logoutModal = document.getElementById('logoutModal');
const closeModal = document.querySelectorAll('.close-modal');
const registerTypeBtns = document.querySelectorAll('.register-type-btn');
const confirmSingles = document.getElementById('confirmSingles');
const confirmDoubles = document.getElementById('confirmDoubles');
const partnerSearch = document.getElementById('partnerSearch');
const searchResults = document.getElementById('searchResults');
const partnerResult = document.getElementById('partnerResult');
const selectedPartner = document.getElementById('selectedPartner');
const selectedPartnerId = document.getElementById('selectedPartnerId');
const teamName = document.getElementById('teamName');

let countdownTimer;
let players = [];
let playerRegistrationStatus = {};
let playerInfo;

// Add spin animation for refresh button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

async function initPage() {
    try {
        const response = await fetch('/player/info');
        const data = await response.json();
        playerInfo = data;
        
        document.getElementById('dbplayer1').value = playerInfo.name;
        
        const response1 = await fetch('/player/allPlayerInfo');
        const data1 = await response1.json();
        players = data1.map((element, index) => ({
            id: index + 1,
            name: element.name,
            prn: element.prn,
            email: element.email
        }));

        const response2 = await fetch('/register/check-register');
        playerRegistrationStatus = await response2.json();

        pageTitle.innerText = `Welcome, ${data.name}!`;
        const profileDetails = document.getElementById('profileDetails');
        let yearVar = "";
        if(data.year == 'FE'){
            yearVar = 'First Year';
        }else if(data.year == 'SE'){
            yearVar = 'Second Year';
        }else if(data.year == 'TE'){
            yearVar = 'Third Year';
        }else{
            yearVar = 'Final Year';
        }
        
        profileDetails.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">PRN Number</div>
                <div class="detail-value">${data.prn}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Department</div>
                <div class="detail-value">${data.branch}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Year</div>
                <div class="detail-value">${yearVar}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Gender</div>
                <div class="detail-value">${data.gender}</div>
            </div>
        `;

        document.getElementById('profile_content_name').innerText = data.name;

        // Update registration status display
        updateRegistrationStatus();

        // Show appropriate content based on registration status
        if (!playerRegistrationStatus.singles && !playerRegistrationStatus.doubles) {
            // Not registered for any match type - Show registration closed message
            registrationPrompt.style.display = 'block';
            matchesSection.style.display = 'none';
            noUpcomingMatches.style.display = 'none';
            noCompletedMatches.style.display = 'none';
            
            // Update registration prompt to show closed message
            registrationPrompt.innerHTML = `
                <i class="fas fa-lock"></i>
                <h2>Registration Closed</h2>
                <p>Tournament registration is now closed for all categories. You cannot register for any matches at this time.</p>
                <div class="registration-closed-info">
                    <p><strong>Note:</strong> The registration period has ended.</p>
                </div>
            `;
        } else {
            // Registered for at least one match type
            registrationPrompt.style.display = 'none';
            matchesSection.style.display = 'block';
            await loadMatches();
        }
    } catch (error) {
        console.log(error);
        showNotification('Error loading page data', 'error');
    }
}

// Update registration status display - REGISTRATION CLOSED FOR ALL
function updateRegistrationStatus() {
    registrationStatus.innerHTML = '';
    registerButtons.innerHTML = '';

    // Show registration closed message for all players
    const closedMessage = document.createElement('div');
    closedMessage.className = 'registration-closed-message';
    closedMessage.innerHTML = `
        <i class="fas fa-lock"></i>
        <div>
            <h3>Registration Closed</h3>
            <p>Tournament registration is now closed for all categories.</p>
        </div>
    `;
    registrationStatus.appendChild(closedMessage);

    // Hide register buttons completely
    registerButtons.style.display = 'none';

    // Show current registration status badges if already registered
    if (playerRegistrationStatus.singles) {
        const badge = document.createElement('div');
        badge.className = 'status-badge status-singles';
        badge.innerHTML = '<i class="fas fa-user"></i> Registered for Singles';
        registrationStatus.appendChild(badge);
    }
    
    if (playerRegistrationStatus.doubles) {
        const badge = document.createElement('div');
        badge.className = 'status-badge status-doubles';
        badge.innerHTML = `<i class="fas fa-users"></i> Registered for Doubles: ${playerRegistrationStatus.teamName} (with ${playerRegistrationStatus.playerName2})`;
        registrationStatus.appendChild(badge);
    }
}

// Load matches from backend
async function loadMatches() {
    try {
        const response = await fetch('/player/matches');
        const matchesData = await response.json();
        console.log('Matches data:', matchesData);
        
        // Filter matches based on current view
        let filteredMatches;
        if (currentView === 'upcoming') {
            filteredMatches = matchesData.filter(match => 
                match.status === 'upcoming' || match.status === 'live'
            );
            matchesSectionTitle.textContent = 'Upcoming Matches';
        } else {
            filteredMatches = matchesData.filter(match => match.status === 'completed');
            matchesSectionTitle.textContent = 'Completed Matches';
        }

        console.log('Filtered matches:', filteredMatches);

        // Hide all no matches messages first
        noUpcomingMatches.style.display = 'none';
        noCompletedMatches.style.display = 'none';
        matchesContainer.style.display = 'flex';

        if (filteredMatches.length === 0) {
            matchesContainer.style.display = 'none';

            if (currentView === 'upcoming') {
                noUpcomingMatches.style.display = 'block';
            } else {
                noCompletedMatches.style.display = 'block';
            }
            return;
        }

        matchesContainer.innerHTML = '';

        // Sort matches: live first, then upcoming by date, completed by date (newest first)
        if (currentView === 'upcoming') {
            filteredMatches.sort((a, b) => {
                if (a.status === 'live') return -1;
                if (b.status === 'live') return 1;
                return new Date(a.date) - new Date(b.date);
            });
        } else {
            filteredMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        filteredMatches.forEach(match => {
            const matchCard = createMatchCard(match);
            matchesContainer.appendChild(matchCard);
        });

    } catch (error) {
        console.error('Error loading matches:', error);
        showNotification('Error loading matches. Please try again.', 'error');
        
        // Show appropriate no matches message
        matchesContainer.style.display = 'none';
        if (currentView === 'upcoming') {
            noUpcomingMatches.style.display = 'block';
        } else {
            noCompletedMatches.style.display = 'block';
        }
    }
}

// Function to get round display name
function getRoundDisplayName(matchRound) {
    if (matchRound == 'round1') {
        return 'Round 1';
    } else if (matchRound == 'round2') {
        return 'Round 2';
    } else if (matchRound == 'round3') {
        return 'Round 3';
    } else if (matchRound == 'quarter') {
        return 'Quarter Final';
    } else if (matchRound == 'semi') {
        return 'Semi Final';
    } else if (matchRound == 'final') {
        return 'Final';
    } else {
        return matchRound || 'Round 1';
    }
}

// Create match card HTML
function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.setAttribute('data-status', match.status);

    let statusClass = '';
    let statusText = '';
    switch (match.status) {
        case 'live':
            statusClass = 'status-live';
            statusText = 'Live';
            break;
        case 'upcoming':
            statusClass = 'status-upcoming';
            statusText = 'Upcoming';
            break;
        case 'completed':
            statusClass = 'status-completed';
            statusText = 'Completed';
            break;
        default:
            statusClass = 'status-upcoming';
            statusText = 'Upcoming';
    }

    // Determine match type and team names based on match data
    const matchType = match.matchType || 'Singles';
    let team1Name = match.playerName1 || 'TBD';
    let team2Name = match.playerName2 || 'TBD';
    
    if (matchType === 'Doubles') {
        team1Name = match.teamName1 || `${match.teamt1email1 ? 'Team 1' : 'TBD'}`;
        team2Name = match.teamName2 || `${match.teamt2email1 ? 'Team 2' : 'TBD'}`;
    }

    // Get round display name
    const roundDisplayName = getRoundDisplayName(match.round);

    // Calculate scores and determine winner
    let score1 = '-';
    let score2 = '-';
    let winnerName = '';
    
    if (match.status === 'completed' && match.isComplete) {
        if (match.winnerEmail) {
            // Determine winner based on email
            if (matchType === 'Singles') {
                winnerName = match.winnerEmail === match.email1 ? team1Name : team2Name;
                score1 = match.winnerEmail === match.email1 ? 'W' : 'L';
                score2 = match.winnerEmail === match.email2 ? 'W' : 'L';
            } else {
                // For doubles - check if winner email belongs to team1
                const isTeam1Winner = match.winnerEmail === match.teamt1email1 || match.winnerEmail === match.teamt1email2;
                winnerName = isTeam1Winner ? team1Name : team2Name;
                score1 = isTeam1Winner ? 'W' : 'L';
                score2 = isTeam1Winner ? 'L' : 'W';
            }
        } else if (match.set && match.set.length > 0) {
            // Calculate winner from sets
            let wins1 = 0;
            let wins2 = 0;
            
            match.set.forEach(set => {
                if (set.isSetComplete) {
                    if (set.player1Point > set.player2Point) {
                        wins1++;
                    } else if (set.player2Point > set.player1Point) {
                        wins2++;
                    }
                }
            });
            
            score1 = wins1 > wins2 ? 'W' : 'L';
            score2 = wins2 > wins1 ? 'W' : 'L';
            winnerName = wins1 > wins2 ? team1Name : team2Name;
        }
    } else if (match.status === 'live') {
        // For live matches, show current points from the last set
        if (match.set && match.set.length > 0) {
            const currentSet = match.set[match.set.length - 1];
            score1 = currentSet.player1Point || '0';
            score2 = currentSet.player2Point || '0';
        }
    }

    // Format date and time
    let dateTimeHTML = '';
    if (match.date) {
        if (match.time) {
            dateTimeHTML = `
                <div class="detail-item">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${match.date}, ${match.time}</span>
                </div>
            `;
        } else {
            dateTimeHTML = `
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${match.date}</span>
                </div>
            `;
        }
    }

    // Format sets for completed matches
    let setsHTML = '';
    let matchDetailsHTML = '';

    if (match.status === 'completed') {
        // For completed matches, show detailed information
        matchDetailsHTML = `
            ${dateTimeHTML}
            <div class="detail-item">
                <span class="detail-label">Court:</span>
                <span class="detail-value">${match.court || 'TBD'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Referee:</span>
                <span class="detail-value">${match.refreeName || 'TBD'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Sets:</span>
                <span class="detail-value">${match.maxSets || '3'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Set Point:</span>
                <span class="detail-value">${match.maxSetPoint || '21'}</span>
            </div>
            ${winnerName ? `
                <div class="detail-item">
                    <span class="detail-label">Winner:</span>
                    <span class="detail-value" style="color: var(--success); font-weight: bold;">${winnerName}</span>
                </div>
            ` : ''}
        `;

        // Show sets for completed matches
        if (match.set && match.set.length > 0) {
            const completedSets = match.set.filter(set => set.isSetComplete);
            
            if (completedSets.length > 0) {
                setsHTML = `
                    <div class="sets-container">
                        <div class="sets-title">Sets</div>
                        <div class="sets-grid">
                            ${completedSets.map((set, index) => {
                                const setWinner = set.player1Point > set.player2Point ? team1Name : team2Name;
                                return `
                                    <div class="set-item">
                                        <div class="set-number">Set ${index + 1}</div>
                                        <div class="set-score">${set.player1Point || 0}-${set.player2Point || 0}</div>
                                        <div class="set-winner">Winner: ${setWinner}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        }
    } else {
        // For upcoming/live matches, show minimal information
        matchDetailsHTML = dateTimeHTML;
        
        // Show current set for live matches
        if (match.status === 'live' && match.set && match.set.length > 0) {
            const currentSet = match.set[match.set.length - 1];
            setsHTML = `
                <div class="sets-container">
                    <div class="sets-title">Current Set</div>
                    <div class="sets-grid">
                        <div class="set-item">
                            <div class="set-number">Set ${match.set.length}</div>
                            <div class="set-score">${currentSet.player1Point || 0}-${currentSet.player2Point || 0}</div>
                            ${currentSet.serve ? `<div class="set-serve">Serve: ${currentSet.serve}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    card.innerHTML = `
        <div class="match-header">
            <span class="match-status ${statusClass}">${statusText}</span>
            <span class="match-type">${matchType}</span>
        </div>
        <div class="match-body">
            <div class="match-round">${roundDisplayName}</div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-name">${team1Name}</div>
                    <div class="team-score">${score1}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <div class="team-name">${team2Name}</div>
                    <div class="team-score">${score2}</div>
                </div>
            </div>
            <div class="match-details">
                ${matchDetailsHTML}
            </div>
            ${setsHTML}
        </div>
    `;
    return card;
}


// View toggle functionality
viewUpcoming.addEventListener('click', () => {
    if (currentView !== 'upcoming') {
        viewUpcoming.classList.add('active');
        viewCompleted.classList.remove('active');
        currentView = 'upcoming';
        loadMatches();
    }
});

viewCompleted.addEventListener('click', () => {
    if (currentView !== 'completed') {
        viewUpcoming.classList.remove('active');
        viewCompleted.classList.add('active');
        currentView = 'completed';
        loadMatches();
    }
});

// Search players function
function searchPlayers(query) {
    if (!query) {
        searchResults.style.display = 'none';
        return;
    }
    const results = players.filter(player =>
        player.name.toLowerCase().includes(query.toLowerCase()) ||
        player.email.toLowerCase().includes(query.toLowerCase()) ||
        player.prn.toLowerCase().includes(query.toLowerCase())
    );
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No players found</div>';
    } else {
        results.forEach(player => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.setAttribute('data-id', player.id);
            item.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-details">${player.prn} • ${player.email}</div>
            `;
            item.addEventListener('click', () => {
                selectedPartner.value = `${player.name} (PRN: ${player.prn})`;
                selectedPartnerId.value = player.id;
                partnerResult.style.display = 'block';
                searchResults.style.display = 'none';
                partnerSearch.value = '';
                checkDoublesFormValidity();
            });
            searchResults.appendChild(item);
        });
    }
    searchResults.style.display = 'block';
}

// Check if doubles form is valid
function checkDoublesFormValidity() {
    if (teamName.value && selectedPartnerId.value) {
        confirmDoubles.disabled = false;
    } else {
        confirmDoubles.disabled = true;
    }
}

// Mobile Navigation
menuToggle.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.classList.add('mobile-nav-open');
});

closeNav.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.classList.remove('mobile-nav-open');
});

// Navigation handlers
navHome.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
            link.classList.remove('active');
        });
        btn.classList.add('active');
    });
});

// Register Match buttons - DISABLED (Registration Closed)
registerTypeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Registration is closed for all categories. No new registrations are being accepted.', 'info');
    });
});

// Confirm singles registration - DISABLED
confirmSingles.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Registration is closed. Cannot register for singles matches.', 'info');
});

// Search partner functionality
partnerSearch.addEventListener('input', () => {
    searchPlayers(partnerSearch.value);
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!partnerSearch.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

teamName.addEventListener('input', checkDoublesFormValidity);

// Confirm doubles registration - DISABLED
confirmDoubles.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Registration is closed. Cannot register for doubles matches.', 'info');
});

// Show success modal
function showSuccessModal() {
    successModal.classList.add('active');
    let seconds = 3;
    countdownTimer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(countdownTimer);
            successModal.classList.remove('active');
            initPage();
        }
    }, 1000);
}

// Logout functionality
logoutBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutModal.classList.add('active');
    });
});

document.getElementById('confirmLogout').addEventListener('click', async() => {
    try {
        const response = await fetch('/auth/logout');
        const data = await response.json();
        if(data.success){
            window.location.href = '/';
        } else {
            showNotification('Logout failed. Please try again.', 'error');
        }
    } catch (error) {
        console.log(error);
        showNotification('Logout failed. Please try again.', 'error');
    } finally {
        logoutModal.classList.remove('active');
    }
});

// Cancel logout
document.getElementById('cancelLogout').addEventListener('click', () => {
    logoutModal.classList.remove('active');
});

// Scroll functionality
scrollLeftBtn.addEventListener('click', () => {
    matchesContainer.scrollBy({
        left: -320,
        behavior: 'smooth'
    });
});

scrollRightBtn.addEventListener('click', () => {
    matchesContainer.scrollBy({
        left: 320,
        behavior: 'smooth'
    });
});

// Close modals
closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
        singlesModal.classList.remove('active');
        doublesModal.classList.remove('active');
        successModal.classList.remove('active');
        logoutModal.classList.remove('active');
        clearInterval(countdownTimer);
        teamName.value = '';
        partnerSearch.value = '';
        selectedPartner.value = '';
        selectedPartnerId.value = '';
        partnerResult.style.display = 'none';
        confirmDoubles.disabled = true;
        searchResults.style.display = 'none';
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 5000);
    
    notification.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    });
}

// Refresh matches functionality
const refreshMatches = document.getElementById('refreshMatches');
if (refreshMatches) {
    refreshMatches.addEventListener('click', async () => {
        refreshMatches.style.animation = 'spin 1s linear';
        await loadMatches();
        setTimeout(() => {
            refreshMatches.style.animation = '';
        }, 1000);
    });
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    await initPage();
    
    // Handle visibility of doubles registration elements based on gender
    if (playerInfo && playerInfo.gender === 'Male') {
        const doublesRegistrationElements = document.querySelectorAll('[data-type="doubles"]');
        doublesRegistrationElements.forEach(element => {
            element.style.display = 'none';
        });
    }
});

// Add event listener for escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal.forEach(btn => btn.click());
    }
});

// Auto-refresh matches every 30 seconds for live matches
setInterval(() => {
    if (currentView === 'upcoming') {
        loadMatches();
    }
}, 30000);