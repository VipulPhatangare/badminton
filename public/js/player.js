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
// const countdown = document.getElementById('countdown');





let countdownTimer;

// Sample player data for search
let players = [];

let playerRegistrationStatus = {};

let playerInfo;

async function initPage() {
    
    try {

        const response = await fetch('/player/info');
        const data = await response.json();
        playerInfo = data;
        // console.log(data);
        document.getElementById('dbplayer1').value = playerInfo.name;
        const response1 = await fetch('/player/allPlayerInfo')
        const data1 = await response1.json();
        // console.log(data1);
        players = data1.map((element, index) => ({
            id: index + 1,
            name: element.name,
            prn: element.prn,
            email: element.email
        }));

        const response2 = await fetch('/register/check-register')
        playerRegistrationStatus = await response2.json();
        // console.log(playerRegistrationStatus);

        


        pageTitle.innerText = `Welcome, ${data.name}!`;
        profileDetails = document.getElementById('profileDetails');
        let yearVar = "";
        if(data.year == 'FE'){
          yearVar = 'First Year';
        }else if(data.year == 'SE'){
          yearVar = 'Second Year';
        }else if(data.year == 'TE'){
          yearVar = 'Thrid Year';
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
            // Not registered for any match type
            registrationPrompt.style.display = 'block';
            matchesSection.style.display = 'none';
            noUpcomingMatches.style.display = 'none';
            noCompletedMatches.style.display = 'none';
        } else {
            // Registered for at least one match type
            registrationPrompt.style.display = 'none';
            matchesSection.style.display = 'block';
            loadMatches();
        }
    } catch (error) {
        console.log(error);   
    }
}

// Update registration status display
function updateRegistrationStatus() {
  registrationStatus.innerHTML = '';
  registerButtons.innerHTML = '';

  // Show current registration status badges
  if (playerRegistrationStatus.singles) {
    const badge = document.createElement('div');
    badge.className = 'status-badge status-singles';
    badge.innerHTML = '<i class="fas fa-user"></i> Registered for Singles';
    registrationStatus.appendChild(badge);

    // Add doubles registration button for female players if not already registered for doubles
    if (!playerRegistrationStatus.doubles && playerInfo.gender === 'Female') {
      const doublesBtn = document.createElement('button');
      doublesBtn.className = 'register-match-btn';
      doublesBtn.setAttribute('data-type', 'doubles');
      doublesBtn.innerHTML = 'Register for Doubles';
      doublesBtn.addEventListener('click', () => {
        doublesModal.classList.add('active');
      });
      registerButtons.appendChild(doublesBtn);
    }
  } 
  else if (playerRegistrationStatus.doubles) {
    const badge = document.createElement('div');
    badge.className = 'status-badge status-doubles';
    badge.innerHTML = `<i class="fas fa-users"></i> Registered for Doubles: ${playerRegistrationStatus.teamName} (with ${playerRegistrationStatus.playerName2})`;
    registrationStatus.appendChild(badge);

    // Add singles registration button if not registered for singles
    if (!playerRegistrationStatus.singles) {
      const singlesBtn = document.createElement('button');
      singlesBtn.className = 'register-match-btn';
      singlesBtn.setAttribute('data-type', 'singles');
      singlesBtn.innerHTML = 'Register for Singles';
      singlesBtn.addEventListener('click', () => {
        singlesModal.classList.add('active');
      });
      registerButtons.appendChild(singlesBtn);
    }
  } 
  else {
    // Show initial registration buttons
    const singlesBtn = document.createElement('button');
    singlesBtn.className = 'register-match-btn';
    singlesBtn.setAttribute('data-type', 'singles');
    singlesBtn.innerHTML = 'Register for Singles';
    singlesBtn.addEventListener('click', () => {
      singlesModal.classList.add('active');
    });
    registerButtons.appendChild(singlesBtn);

    // Show doubles button only for female players
    if (playerInfo.gender === 'Female') {
      const doublesBtn = document.createElement('button');
      doublesBtn.className = 'register-match-btn';
      doublesBtn.setAttribute('data-type', 'doubles');
      doublesBtn.innerHTML = 'Register for Doubles';
      doublesBtn.addEventListener('click', () => {
        doublesModal.classList.add('active');
      });
      registerButtons.appendChild(doublesBtn);
    }
  }

  if (playerRegistrationStatus.doubles) {
    const badge = document.createElement('div');
    badge.className = 'status-badge status-doubles';
    badge.innerHTML = `<i class="fas fa-users"></i> Registered for Doubles: ${playerRegistrationStatus.teamName} (with ${playerRegistrationStatus.playerName2})`;
    registrationStatus.appendChild(badge);

    // Add register for singles button
    if (!playerRegistrationStatus.singles) {
      const singlesBtn = document.createElement('button');
      singlesBtn.className = 'register-match-btn';
      singlesBtn.setAttribute('data-type', 'singles');
      singlesBtn.innerHTML = 'Register for Singles';
      singlesBtn.addEventListener('click', () => {
        singlesModal.classList.add('active');
      });
      registerButtons.appendChild(singlesBtn);
    }
  }
}

// Load matches (dummy data)
function loadMatches() {
  // This would be replaced with actual data from backend
  const allMatches = [
    // {
    //   status: 'live',
    //   type: 'Singles',
    //   round: 'Round of 16',
    //   team1: 'Rajesh Kumar',
    //   team2: 'Amit Sharma',
    //   score1: '1',
    //   score2: '0',
    //   court: 'Court 2',
    //   date: 'Today, 3:30 PM',
    //   referee: 'Prof. Deshmukh',
    //   maxSets: '3',
    //   pointsToWin: '21',
    //   sets: [{ number: 'Set 1', score: '11-9' }],
    //   refereeContact: '+91 9876543210'
    // },
    // {
    //   status: 'upcoming',
    //   type: playerRegistrationStatus.doubles ? 'Doubles' : 'Singles',
    //   round: 'Quarter Final',
    //   team1: playerRegistrationStatus.doubles ? 'Rajesh Kumar & ' + playerRegistrationStatus.doublesPartner : 'Rajesh Kumar',
    //   team2: playerRegistrationStatus.doubles ? 'Suresh Patel & Rahul Mehta' : 'Neha Verma',
    //   score1: '-',
    //   score2: '-',
    //   court: 'Court 1',
    //   date: 'Tomorrow, 10:00 AM',
    //   referee: 'Prof. Joshi',
    //   maxSets: '3',
    //   pointsToWin: '21',
    //   sets: [],
    //   refereeContact: '+91 9765432108'
    // },
    // {
    //   status: 'completed',
    //   type: 'Singles',
    //   round: 'Round of 32',
    //   team1: 'Rajesh Kumar',
    //   team2: 'Rahul Mehta',
    //   score1: '2',
    //   score2: '0',
    //   court: 'Court 3',
    //   date: 'Oct 15, 2023, 2:00 PM',
    //   referee: 'Prof. Kulkarni',
    //   maxSets: '3',
    //   pointsToWin: '21',
    //   sets: [
    //     { number: 'Set 1', score: '21-15' },
    //     { number: 'Set 2', score: '21-18' }
    //   ],
    //   refereeContact: '+91 9654321098',
    //   winner: 'Rajesh Kumar'
    // },
    // {
    //   status: 'completed',
    //   type: 'Singles',
    //   round: 'Practice Match',
    //   team1: 'Rajesh Kumar',
    //   team2: 'Vikram Singh',
    //   score1: '1',
    //   score2: '2',
    //   court: 'Court 4',
    //   date: 'Oct 10, 2023, 4:00 PM',
    //   referee: 'Prof. Patil',
    //   maxSets: '3',
    //   pointsToWin: '21',
    //   sets: [
    //     { number: 'Set 1', score: '21-19' },
    //     { number: 'Set 2', score: '17-21' },
    //     { number: 'Set 3', score: '19-21' }
    //   ],
    //   refereeContact: '+91 9543210987',
    //   winner: 'Vikram Singh'
    // }
  ];

  // Filter matches based on current view
  let filteredMatches;
  if (currentView === 'upcoming') {
    filteredMatches = allMatches.filter(match => match.status !== 'completed');
    matchesSectionTitle.textContent = 'Upcoming Matches';
  } else {
    filteredMatches = allMatches.filter(match => match.status === 'completed');
    matchesSectionTitle.textContent = 'Completed Matches';
  }

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

  // For upcoming view, sort matches: live first, then upcoming
  if (currentView === 'upcoming') {
    filteredMatches.sort((a, b) => {
      if (a.status === 'live') return -1;
      if (b.status === 'live') return 1;
      return 0;
    });
  } else {
    // For completed view, sort by date (newest first)
    filteredMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  filteredMatches.forEach(match => {
    const matchCard = createMatchCard(match);
    matchesContainer.appendChild(matchCard);
  });
}

// Create match card HTML
function createMatchCard(match) {
  const card = document.createElement('div');
  card.className = 'match-card';
  card.setAttribute('data-status', match.status);

  let statusClass = '';
  switch (match.status) {
    case 'live':
      statusClass = 'status-live';
      break;
    case 'upcoming':
      statusClass = 'status-upcoming';
      break;
    case 'completed':
      statusClass = 'status-completed';
      break;
  }

  let setsHTML = '';
  if (match.sets && match.sets.length > 0) {
    setsHTML = `
      <div class="sets-container">
        <div class="sets-title">${match.status === 'live' ? 'Current Set' : 'Sets'}</div>
        <div class="sets-grid">
          ${match.sets.map(set => `
            <div class="set-item">
              <div class="set-number">${set.number}</div>
              <div class="set-score">${set.score}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Add winner info for completed matches
  let winnerHTML = '';
  if (match.status === 'completed') {
    winnerHTML = `
      <div class="detail-item">
        <span class="detail-label">Winner:</span>
        <span class="detail-value" style="color: var(--success);">${match.winner}</span>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="match-header">
      <span class="match-status ${statusClass}">${match.status.charAt(0).toUpperCase() + match.status.slice(1)}</span>
      <span class="match-type">${match.type}</span>
    </div>
    <div class="match-body">
      <div class="match-round">${match.round}</div>
      <div class="match-teams">
        <div class="team">
          <div class="team-name">${match.team1}</div>
          <div class="team-score">${match.score1}</div>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <div class="team-name">${match.team2}</div>
          <div class="team-score">${match.score2}</div>
        </div>
      </div>
      <div class="match-details">
        <div class="detail-item">
          <span class="detail-label">Court:</span>
          <span class="detail-value">${match.court}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date & Time:</span>
          <span class="detail-value">${match.date}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Referee:</span>
          <span class="detail-value">${match.referee}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sets:</span>
          <span class="detail-value">${match.maxSets}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Set Point:</span>
          <span class="detail-value">${match.pointsToWin}</span>
        </div>
        ${winnerHTML}
      </div>
      ${setsHTML}
    </div>
  `;
  return card;
}

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
});

closeNav.addEventListener('click', () => {
  mobileNav.classList.remove('open');
});

// Navigation handlers
navHome.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Update active nav
    document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
      link.classList.remove('active');
    });
    btn.classList.add('active');
  });
});

// Register Match buttons
registerTypeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const type = e.target.getAttribute('data-type');
    
    // Check if already registered
    if ((type === 'singles' && playerRegistrationStatus.singles) || 
        (type === 'doubles' && playerRegistrationStatus.doubles)) {
      showNotification(`You are already registered for ${type} matches.`, 'warning');
      return;
    }
    
    // Handle registration based on type
    if (type === 'singles') {
      singlesModal.classList.add('active');
    } else if (type === 'doubles') {
      // Only allow doubles registration for female players
      if (playerInfo.gender === 'Male') {
        showNotification('Boys Doubles registration is currently closed.', 'info');
        return;
      }
      doublesModal.classList.add('active');
    }
  });
});

// Confirm singles registration
confirmSingles.addEventListener('click', async() => {
    try {
        const response = await fetch("/register/single-register")
        const data = await response.json();
        if(data.success){
            playerRegistrationStatus.singles = true;
            //   localStorage.setItem('playerRegistrationStatus', JSON.stringify(playerRegistrationStatus));

            singlesModal.classList.remove('active');
            showSuccessModal();
        }else{
            showNotification(data.message, 'error');
        }
        
    } catch (error) {
        console.log(error);
    }
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

// Confirm doubles registration

confirmDoubles.addEventListener('click', async() => {
    try {
        const partnerName = selectedPartner.value.split(' (')[0];

        // Find the full partner object by matching the name or ID
        const partner = players.find(
            p => p.id === parseInt(selectedPartnerId.value) || p.name === partnerName
        );

        let tname = teamName.value;
        let email2 = partner.email;
        let email1 = playerInfo.email;
        let gender = playerInfo.gender;
        
        // Check if it's boys doubles and show registration closed message
        if (gender === 'Male') {
            showNotification('Boys Doubles registration is currently closed.', 'error');
            doublesModal.classList.remove('active');
            return;
        }
        
        const response = await fetch("/register/double-register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({tname, email2, email1, gender}),
        });
        
        const data = await response.json();
        
        if(data.success){
            // Update registration status
            playerRegistrationStatus.doubles = true;
            playerRegistrationStatus.playerName2 = partnerName;
            playerRegistrationStatus.teamName = teamName.value;


            doublesModal.classList.remove('active');
            showSuccessModal();
        }else{
            showNotification(data.message, 'error');
        }

    } catch (error) {
        console.log(error);
    }
});

// Show success modal
function showSuccessModal() {
  successModal.classList.add('active');
  let seconds = 1;
  // countdown.textContent = seconds;
  countdownTimer = setInterval(() => {
    seconds--;
    // countdown.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdownTimer);
      successModal.classList.remove('active');
      initPage();
    }
  }, 1000);
}

// Close modals
closeModal.forEach(btn => {
  btn.addEventListener('click', () => {
    singlesModal.classList.remove('active');
    doublesModal.classList.remove('active');
    successModal.classList.remove('active');
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

logoutBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Show confirmation modal instead of directly logging out
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
        logoutModal.classList.remove('active'); // Add this line
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
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 5000);
    
    // Also allow manual dismissal by clicking
    notification.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    });
}

document.addEventListener("DOMContentLoaded",async () => {
    await initPage();
    
    // Handle visibility of doubles registration elements based on gender
    if (playerInfo && playerInfo.gender === 'Male') {
        const doublesRegistrationElements = document.querySelectorAll('[data-type="doubles"]');
        doublesRegistrationElements.forEach(element => {
            element.style.display = 'none';
        });
    }
});
