const centralObj = {};

// Player management functionality
let currentPlayer = null;
let currentAction = null;
let currentCategory = null;

// Function to show confirmation modal
function showConfirmationModal(title, message, action) {
    currentAction = action;
    document.getElementById('confirmationTitle').textContent = title;
    document.getElementById('confirmationMessage').textContent = message;
    document.getElementById('confirmationModal').classList.add('active');
}

// Function to handle player deregistration
function deregisterPlayer(player, category) {
    const categoryText = category === 'singles' ? 'Singles' : 'Doubles';
    
    showConfirmationModal(
        `Deregister from ${categoryText}`, 
        `Are you sure you want to deregister ${player.name} from ${categoryText}?`,
        () => {
            // Send deregister request to server
            fetch('/dashboard/deregister-player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: player.email, 
                    category: category 
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    takePlayerInfo(); // Refresh the player list
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deregistering player');
            });
        }
    );
}

// Function to handle player deletion
function deletePlayer(player) {
    showConfirmationModal(
        "Delete Player", 
        `Are you sure you want to delete ${player.name}'s profile? This action cannot be undone.`,
        () => {
            // Send delete request to server
            fetch('/dashboard/delete-player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: player.email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.isDelete) {
                    alert(data.message);
                    takePlayerInfo();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting player');
            });
        }
    );
}

// 🏸 Dummy data for Boys Singles Matches
const dummy1 = [
  {
    isBye: false,
    email1: "arjun.kumar@example.com",
    playerName1: "Arjun Kumar",
    email2: "raj.sharma@example.com",
    playerName2: "Raj Sharma",
    matchNo: 1,
    refreeName: "Mr. Verma",
    maxSetPoint: 21,
    maxSets: 3,
    round: "Round 1",
    status: "Scheduled",
    set: [],
    date: new Date("2025-09-20"),
    time: "10:00 AM",
    court: 1,
    winnerEmail: "",
    isComplete: false,
    type: "Girls Singles"
  },
  {
    isBye: false,
    email1: "amit.patel@example.com",
    playerName1: "Amit Patel",
    email2: "suresh.nair@example.com",
    playerName2: "Suresh Nair",
    matchNo: 2,
    refreeName: "Ms. Iyer",
    maxSetPoint: 21,
    maxSets: 3,
    round: "Round 1",
    status: "Scheduled",
    set: [],
    date: new Date("2025-09-20"),
    time: "11:00 AM",
    court: 2,
    winnerEmail: "",
    isComplete: false,
    type: "Boys Singles"
  },
  {
    isBye: false,
    email1: "vikram.singh@example.com",
    playerName1: "Vikram Singh",
    email2: "rohit.das@example.com",
    playerName2: "Rohit Das",
    matchNo: 3,
    refreeName: "Mr. Khan",
    maxSetPoint: 21,
    maxSets: 3,
    round: "Quarterfinal",
    status: "Scheduled",
    set: [],
    date: new Date("2025-09-21"),
    time: "09:30 AM",
    court: 1,
    winnerEmail: "",
    isComplete: false,
    type: "Girls Singles"
  },
  {
    isBye: false,
    email1: "deepak.jain@example.com",
    playerName1: "Deepak Jain",
    email2: "karan.mehra@example.com",
    playerName2: "Karan Mehra",
    matchNo: 4,
    refreeName: "Ms. Sen",
    maxSetPoint: 21,
    maxSets: 3,
    round: "Quarterfinal",
    status: "Scheduled",
    set: [],
    date: new Date("2025-09-21"),
    time: "10:30 AM",
    court: 2,
    winnerEmail: "",
    isComplete: false,
    type: "Boys Singles"
  },
  {
    isBye: false,
    email1: "sachin.raju@example.com",
    playerName1: "Sachin Raju",
    email2: "praveen.k@example.com",
    playerName2: "Praveen K",
    matchNo: 5,
    refreeName: "Mr. Dasgupta",
    maxSetPoint: 21,
    maxSets: 3,
    round: "Semifinal",
    status: "Scheduled",
    set: [],
    date: new Date("2025-09-22"),
    time: "11:00 AM",
    court: 3,
    winnerEmail: "",
    isComplete: false,
    type: "Boys Singles"
  }
];

async function takePlayerInfo() {
    try {
        const response = await fetch('/dashboard/players-info');
        const data = await response.json();
        
        centralObj.players = data.players;
        centralObj.singlesPlayers = data.singlesPlayers;
        centralObj.doublesPlayers = data.doublesPlayers;
        centralObj.singlesBoysMatchesList = data.singlesBoysMatchesList;
        centralObj.singlesGirlsMatchesList = data.singlesGirlsMatchesList;
        centralObj.doublesBoysMatchesList = data.doublesBoysMatchesList;
        centralObj.doublesGirlsMatchesList = data.doublesGirlsMatchesList;

        centralObj.totalMatchesCount = 
            data.singlesBoysMatchesList.length + 
            data.singlesGirlsMatchesList.length +
            data.doublesBoysMatchesList.length +
            data.doublesGirlsMatchesList.length;

        centralObj.totalUpcomingMatches = [];
        data.singlesBoysMatchesList.forEach(element => {
            if(!element.isComplete){
                centralObj.totalUpcomingMatches.push(element);
            }
        });

        data.singlesGirlsMatchesList.forEach(element => {
            if(!element.isComplete){
                centralObj.totalUpcomingMatches.push(element);
            }
        });

        data.doublesBoysMatchesList.forEach(element => {
            if(!element.isComplete){
                centralObj.totalUpcomingMatches.push(element);
            }
        });

        data.doublesGirlsMatchesList.forEach(element => {
            if(!element.isComplete){
                centralObj.totalUpcomingMatches.push(element);
            }
        });
        
        document.getElementById('dashboardCardsInfo').innerHTML = `
                    <div class="card stat-card">
                        <div class="stat-label">Total Players</div>
                        <div class="stat-value">${centralObj.players.length}</div>
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="stat-label">Total Matches</div>
                        <div class="stat-value">${centralObj.totalMatchesCount}</div>
                        <div class="stat-icon">
                            <i class="fas fa-table-tennis"></i>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="stat-label">Completed Matches</div>
                        <div class="stat-value">${centralObj.totalMatchesCount-centralObj.totalUpcomingMatches.length}</div>
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="stat-label">Upcoming Matches</div>
                        <div class="stat-value">${centralObj.totalUpcomingMatches.length}</div>
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
        `;

        dashboardUpcomingMatches = document.getElementById('dashboardUpcomingMatches');
        dashboardUpcomingMatches.innerHTML = '';
        // centralObj.totalUpcomingMatches = dummy1;
        if(centralObj.totalUpcomingMatches.length == 0){
            dashboardUpcomingMatches.innerHTML = `
                 <div class="section-header" style="justify-content: center;">
                        <h1 class="section-title" style="font-size: 30px;">No any upcoming matches.</h1>
                        
                    </div>
            `;
        }else{
            let tableContent = `
                    <div class="section-header">
                        <h2 class="section-title">Upcoming Matches</h2>
                        <div class="filter-bar">
                        <div class="filter-group">
                            <div class="filter-label">Filter by Category</div>
                            <select id="matchCategoryFilter">
                                <option value="all">All Categories</option>
                                <option value="Boys Singles">Boys Singles</option>
                                <option value="Girls Singles">Girls Singles</option>
                                <option value="Boys Doubles">Boys Doubles</option>
                                <option value="Girls Doubles">Girls Doubles</option>
                            </select>
                        </div>
                        </div>
                    </div>

                    <!-- Add this filter bar in the Recent Matches section -->
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Category</th>
                                    <th>Round</th>
                                    <th>Players</th>
                                    <th>Date & Time</th>
                                    <th>Court</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
            `;

            let count = 1;
            centralObj.totalUpcomingMatches.forEach(element => {
                tableContent += `
                                <tr>
                                    <td>${count++}</td>
                                    <td>${element.type}</td>
                                    <td>${element.round}</td>
                                    <td>${element.playerName1} vs ${element.playerName2}</td>
                                    <td>${element.date}, ${element.time}</td>
                                    <td>Court ${element.court}</td>
                                    
                                </tr>`;
            });

            tableContent += `
                            </tbody>
                        </table>
                    </div>
            `;

            dashboardUpcomingMatches.innerHTML = tableContent;
        }
    } catch (error) {
        console.error(error);
    }
}

function playersSectionInfo() {
    try {
        playerSectionTbody = document.getElementById('playerSectionTbody');
        playerSectionTbody.innerHTML = ''; // Clear existing content
        
        centralObj.players.forEach(element => {
            if(element.singles || element.doubles){
                const trTag = document.createElement('tr');
                let category = '';
                if(element.gender == 'Male'){
                    if(element.singles && element.doubles){
                        category = 'Boys Singles, Boys Doubles';
                    }else if(element.singles){
                        category = 'Boys Singles';
                    }else{
                        category = 'Boys Doubles';
                    }
                }else{
                    if(element.singles && element.doubles){
                        category = 'Girls Singles, Girls Doubles';
                    }else if(element.singles){
                        category = 'Girls Singles';
                    }else{
                        category = 'Girls Doubles';
                    }
                }
                let year = '';
                if(element.year == 'FE'){
                    year = 'First Year';
                }else if(element.year == 'SE'){
                    year = 'Second Year';
                }else if(element.year == 'TE'){
                    year = 'Third Year';
                }else if(element.year == 'BE'){
                    year = 'Final Year';
                }

                trTag.innerHTML = `
                                    <td>${element.name}</td>
                                    <td>${element.phone}</td>
                                    <td>${element.email}</td>
                                    <td>${element.branch}</td>
                                    <td>${year}</td>
                                    <td>${category}</td>
                                    <td>
                                        <div class="action-buttons-container">
                                            <button class="action-btn btn-delete-singles" data-email="${element.email}" ${!element.singles ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                                <i class="fas fa-user-minus"></i> Singles
                                            </button>
                                            <button class="action-btn btn-delete-doubles" data-email="${element.email}" ${!element.doubles ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                                <i class="fas fa-users-slash"></i> Doubles
                                            </button>
                                            <button class="action-btn btn-delete-profile" data-email="${element.email}">
                                                <i class="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </td>
                `;

                playerSectionTbody.appendChild(trTag);
            }
        });

        // Set up filter event listeners
        document.getElementById('branchFilter').addEventListener('change', filterPlayers);
        document.getElementById('yearFilter').addEventListener('change', filterPlayers);
        document.getElementById('playerSearch').addEventListener('input', filterPlayers);

    } catch (error) {
        console.log(error);
    }
}

function filterPlayers() {
    const branchFilter = document.getElementById('branchFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    
    const playerRows = document.querySelectorAll('#playerSectionTbody tr');
    
    playerRows.forEach(row => {
        const branch = row.cells[3].textContent;
        const year = row.cells[4].textContent;
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        
        let showRow = true;
        
        // Apply branch filter
        if (branchFilter !== 'all' && branch !== branchFilter) {
            showRow = false;
        }
        
        // Apply year filter
        if (yearFilter !== 'all' && year !== yearFilter) {
            showRow = false;
        }
        
        // Apply search filter
        if (searchTerm && !name.includes(searchTerm) && !email.includes(searchTerm)) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

function filterMatchesByCategory() {
    const selectedCategory = document.getElementById('matchCategoryFilter').value;
    const table = document.querySelector('#dashboardUpcomingMatches table tbody');
    
    table.innerHTML = '';
    
    // Filter matches if a specific category is selected
    const filteredMatches = selectedCategory === 'all' 
        ? centralObj.totalUpcomingMatches 
        : centralObj.totalUpcomingMatches.filter(match => match.type === selectedCategory);
    
    // Populate the table with filtered matches
    let count = 1;
    filteredMatches.forEach(match => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${count++}</td>
            <td>${match.type}</td>
            <td>${match.round}</td>
            <td>${match.playerName1} vs ${match.playerName2}</td>
            <td>${match.date}, ${match.time}</td>
            <td>Court ${match.court}</td>
        `;
        
        table.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', async()=>{
    await takePlayerInfo();
    const categoryFilter = document.getElementById('matchCategoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMatchesByCategory);
    }
    playersSectionInfo();
    
    // Confirmation modal actions
    document.getElementById('confirmAction').addEventListener('click', function() {
        if (currentAction) {
            currentAction();
        }
        document.getElementById('confirmationModal').classList.remove('active');
    });
    
    document.getElementById('cancelAction').addEventListener('click', function() {
        document.getElementById('confirmationModal').classList.remove('active');
    });
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal-overlay').classList.remove('active');
        });
    });
    
    // Add event listeners to action buttons using event delegation
    document.addEventListener('click', function(e) {
        // Singles deregister button
        if (e.target.closest('.btn-delete-singles')) {
            const email = e.target.closest('.btn-delete-singles').getAttribute('data-email');
            const player = centralObj.players.find(p => p.email === email);
            if (player) {
                deregisterPlayer(player, 'singles');
            }
        }
        
        // Doubles deregister button
        if (e.target.closest('.btn-delete-doubles')) {
            const email = e.target.closest('.btn-delete-doubles').getAttribute('data-email');
            const player = centralObj.players.find(p => p.email === email);
            if (player) {
                deregisterPlayer(player, 'doubles');
            }
        }
        
        // Delete profile button
        if (e.target.closest('.btn-delete-profile')) {
            const email = e.target.closest('.btn-delete-profile').getAttribute('data-email');
            const player = centralObj.players.find(p => p.email === email);
            if (player) {
                deletePlayer(player);
            }
        }
    });
});

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', function () {
    sidebar.classList.toggle('active');
});

// Navigation
const menuItems = document.querySelectorAll('.menu-item');
const sectionContents = document.querySelectorAll('.section-content');
const pageTitle = document.getElementById('pageTitle');

menuItems.forEach(item => {
    if (item.classList.contains('logout-btn')) return;

    item.addEventListener('click', function () {
        const section = this.getAttribute('data-section');

        // Update active menu item
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Show corresponding section
        sectionContents.forEach(content => content.style.display = 'none');
        document.getElementById(section + 'Section').style.display = 'block';

        // Update page title
        pageTitle.textContent = this.querySelector('span').textContent;

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 576) {
            sidebar.classList.remove('active');
        }
    });
});

// View toggle for matches
const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
const tableView = document.getElementById('tableView');
const bracketView = document.getElementById('bracketView');

viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const view = this.getAttribute('data-view');

        if (view === 'table') {
            tableView.style.display = 'block';
            bracketView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            bracketView.style.display = 'block';
        }
    });
});

// Logout functionality
const logoutBtn = document.querySelector('.logout-btn');
const logoutModal = document.getElementById('logoutModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

logoutBtn.addEventListener('click', function () {
    logoutModal.classList.add('active');
});

cancelLogout.addEventListener('click', function () {
    logoutModal.classList.remove('active');
});

confirmLogout.addEventListener('click', function () {
    // Redirect or perform logout logic here
    alert('Logging out...');
    logoutModal.classList.remove('active');
});

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});