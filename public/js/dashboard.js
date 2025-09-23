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
async function deregisterPlayer(player, category) {
    const categoryText = category === 'singles' ? 'Singles' : 'Doubles';
    
    showConfirmationModal(
        `Deregister from ${categoryText}`, 
        `Are you sure you want to deregister ${player.name} from ${categoryText}?`,
        async () => {
            // Send deregister request to server
            await fetch('/dashboard/deregister-player', {
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
async function deletePlayer(player) {
    showConfirmationModal(
        "Delete Player", 
        `Are you sure you want to delete ${player.name}'s profile? This action cannot be undone.`,
        async () => {
            // Send delete request to server
            await fetch('/dashboard/delete-player', {
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

        centralObj.allMatches = []
            .concat(
                data.singlesBoysMatchesList,
                data.singlesGirlsMatchesList,
                data.doublesBoysMatchesList,
                data.doublesGirlsMatchesList
            );

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
        
        // Update dashboard cards
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
                        <div class="stat-value">${centralObj.totalMatchesCount - centralObj.totalUpcomingMatches.length}</div>
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

        // Calculate and update registration counts
        calculateRegistrationCounts();

        // Update upcoming matches section
        const dashboardUpcomingMatches = document.getElementById('dashboardUpcomingMatches');
        dashboardUpcomingMatches.innerHTML = '';
        
        if(centralObj.totalUpcomingMatches.length === 0){
            dashboardUpcomingMatches.innerHTML = `
                 <div class="section-header" style="justify-content: center;">
                        <h1 class="section-title" style="font-size: 30px;">No any upcoming matches.</h1>
                </div>
            `;
        } else {
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
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Category</th>
                                    <th>Round</th>
                                    <th>Players / Teams</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            let count = 1;
            centralObj.totalUpcomingMatches.forEach(element => {
                if(element.playerName1 && element.playerName2){
                    tableContent += `
                                <tr>
                                    <td>${count++}</td>
                                    <td>${element.matchType}</td>
                                    <td>${element.round}</td>
                                    <td>${element.playerName1} vs ${element.playerName2}</td>
                                    <td>${element.date}, ${element.time}</td>
                                </tr>`;
                } else {
                    tableContent += `
                                <tr>
                                    <td>${count++}</td>
                                    <td>${element.matchType}</td>
                                    <td>${element.round}</td>
                                    <td>${element.teamName1} vs ${element.teamName2}</td>
                                    <td>${element.date}, ${element.time}</td>
                                </tr>`;
                }
            });

            tableContent += `
                            </tbody>
                        </table>
                    </div>
            `;

            dashboardUpcomingMatches.innerHTML = tableContent;

            // Re-attach event listener for category filter
            const categoryFilter = document.getElementById('matchCategoryFilter');
            if (categoryFilter) {
                categoryFilter.addEventListener('change', filterMatchesByCategory);
            }
        }

    } catch (error) {
        console.error('Error in takePlayerInfo:', error);
    }
}

// Registration counts calculation function
function calculateRegistrationCounts() {
    if (!centralObj.players || centralObj.players.length === 0) {
        // Set counts to zero if no players data
        document.getElementById('boysSinglesCount').innerHTML = 
            `<i class="fas fa-male"></i><span>BS: 0</span>`;
        document.getElementById('girlsSinglesCount').innerHTML = 
            `<i class="fas fa-female"></i><span>GS: 0</span>`;
        document.getElementById('boysDoublesCount').innerHTML = 
            `<i class="fas fa-male"></i><i class="fas fa-male"></i><span>BD: 0</span>`;
        document.getElementById('girlsDoublesCount').innerHTML = 
            `<i class="fas fa-female"></i><i class="fas fa-female"></i><span>GD: 0</span>`;
        return;
    }

    const boysSinglesCount = centralObj.players.filter(player => 
        player.gender === 'Male' && player.singles
    ).length;
    
    const girlsSinglesCount = centralObj.players.filter(player => 
        player.gender === 'Female' && player.singles
    ).length;
    
    const boysDoublesCount = centralObj.players.filter(player => 
        player.gender === 'Male' && player.doubles
    ).length;
    
    const girlsDoublesCount = centralObj.players.filter(player => 
        player.gender === 'Female' && player.doubles
    ).length;
    
    // Update the count badges
    document.getElementById('boysSinglesCount').innerHTML = 
        `<i class="fas fa-male"></i><span>BS: ${boysSinglesCount}</span>`;
    
    document.getElementById('girlsSinglesCount').innerHTML = 
        `<i class="fas fa-female"></i><span>GS: ${girlsSinglesCount}</span>`;
    
    document.getElementById('boysDoublesCount').innerHTML = 
        `<i class="fas fa-male"></i><i class="fas fa-male"></i><span>BD: ${boysDoublesCount}</span>`;
    
    document.getElementById('girlsDoublesCount').innerHTML = 
        `<i class="fas fa-female"></i><i class="fas fa-female"></i><span>GD: ${girlsDoublesCount}</span>`;
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

        // Calculate and display registration counts
        calculateRegistrationCounts();

        // Set up filter event listeners
        document.getElementById('branchFilter').addEventListener('change', filterPlayers);
        document.getElementById('yearFilter').addEventListener('change', filterPlayers);
        document.getElementById('categoryFilter').addEventListener('change', filterPlayers);
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
        : centralObj.totalUpcomingMatches.filter(match => match.matchType === selectedCategory);
    
    // Populate the table with filtered matches
    let count = 1;
    filteredMatches.forEach(match => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${count++}</td>
            <td>${match.matchType}</td>
            <td>${match.round}</td>
            <td>${match.playerName1} vs ${match.playerName2}</td>
            <td>${match.date}, ${match.time}</td>
        `;
        
        table.appendChild(row);
    });
}




async function takeMatchInfo() {
    try {
        
        const matchSectionTbody = document.getElementById('matchSectionTbody');
        centralObj.allMatches.forEach(element => {
            const trTag = document.createElement('tr');
            let status = '';
            let win = '';
            if(!element.isComplete){
                status = '<span class="badge badge-warning">Upcoming</span>';
            }else{
                status = '<span class="badge badge-success">Completed</span>';
            }
            let set = '';
            if(element.isBye){
                set = 'Bye';
            }else if(element.set.length == 0){
                set = '-';
            }else {
                for(let i = 0; i < element.set.length-1; i++){
                    set +=`${element.set[i].player1Point}-${element.set[i].player2Point}, `; 
                }
                set = set.replace(/,\s*$/, ""); 
            }
            
            trTag.innerHTML = `
                <td>${element.matchNo}</td>
                <td>${element.matchType}</td>
                <td>${element.round}</td>
                <td>${element.playerName1 || element.teamName1} vs ${element.playerName2 || element.teamName2}</td>
                <td>${element.date}, ${element.time}</td>
                <td>${status}</td>
                <td>${set}</td>
                <td>
                    <button class="action-btn btn-delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            matchSectionTbody.appendChild(trTag);
        });

    } catch (error) {
        console.log(error);
    }
}



function updateMatchSection(matchesObj) {
    try {
        
        const matchSectionTbody = document.getElementById('matchSectionTbody');
        matchSectionTbody.innerHTML = '';
        matchesObj.forEach(element => {
            const trTag = document.createElement('tr');
            let status = '';
    
            if(!element.isComplete){
                status = '<span class="badge badge-warning">Upcoming</span>';
            }else{
                status = '<span class="badge badge-success">Completed</span>';
            }
            let set = '';
            if(element.set.length == 0){
                set = '-';
            }else{
                set = 'Have points';
            }
            
            trTag.innerHTML = `
                <td>${element.matchNo}</td>
                <td>${element.matchType}</td>
                <td>${element.round}</td>
                <td>${element.playerName1 || element.teamName1} vs ${element.playerName2 || element.teamName2}</td>
                <td>${element.date}, ${element.time}</td>
                <td>${status}</td>
                <td>${set}</td>
                <td>
                    <button class="action-btn btn-delete"><i class="fas fa-trash"></i></button>
                </td>
            `;

            matchSectionTbody.appendChild(trTag);
        });

    } catch (error) {
        console.log(error);
    }
}


function filterMatcheSectionByCategory() {
    const selectedCategory = document.getElementById('matchSectioncategoryFilter').value;
    const filteredMatches = selectedCategory === 'all' 
        ? centralObj.allMatches 
        : centralObj.allMatches.filter(match => match.matchType === selectedCategory);
    updateMatchSection(filteredMatches);
}




function filterMatcheSectionByStatus() {
    const selectedCategory = document.getElementById('matchSectionStatusFilter').value;
    const filteredMatches = selectedCategory === 'all' 
        ? centralObj.allMatches 
        : centralObj.allMatches.filter(match => match.status === selectedCategory);
    updateMatchSection(filteredMatches);
}


async function handleMatchDelete(match) {
    // console.log("Match Information to be deleted:", match);
    
    showConfirmationModal(
        "Delete Match", 
        `Are you sure you want to delete ${match.playerName1 || match.teamName1} vs ${match.playerName2 || match.teamName2} match? This action cannot be undone.`,
        async () => {
            await fetch('/dashboard/delete-match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(match)
            })
            .then(response => response.json())
            .then(data => {
                if (data.isDelete) {
                    alert(data.message);
                    takePlayerInfo();
                    updateMatchSection(centralObj.allMatches);
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

async function takeRefreeInfo() {
    try {
        const response = await fetch('/dashboard/get-refree-info');
        const data = await response.json();
        // console.log(data);
        const tbody = document.getElementById('refereesList');
        
        data.forEach(referee => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${referee.name}</td>
                <td>${referee.refEmail}</td>
                <td>${referee.phone}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.log(error);
    }
}


document.addEventListener('DOMContentLoaded', async()=>{
    await takePlayerInfo();
    await takeMatchInfo();
    await takeRefreeInfo();

    const categoryFilter = document.getElementById('matchCategoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMatchesByCategory);
    }

    const matchSectioncategoryFilter = document.getElementById('matchSectioncategoryFilter');
    if (matchSectioncategoryFilter) {
        matchSectioncategoryFilter.addEventListener('change', filterMatcheSectionByCategory);
    }

    const matchSectionStatusFilter = document.getElementById('matchSectionStatusFilter');
    if (matchSectionStatusFilter) {
        matchSectionStatusFilter.addEventListener('change', filterMatcheSectionByStatus);
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
    document.addEventListener('click', async function(e) {
        // Singles deregister button
        if (e.target.closest('.btn-delete-singles')) {
            const email = e.target.closest('.btn-delete-singles').getAttribute('data-email');
            const player = centralObj.players.find(p => p.email === email);
            if (player) {
                await deregisterPlayer(player, 'singles');
            }
        }
        
        // Doubles deregister button
        if (e.target.closest('.btn-delete-doubles')) {
            const email = e.target.closest('.btn-delete-doubles').getAttribute('data-email');
            const player = centralObj.players.find(p => p.email === email);
            if (player) {
                await deregisterPlayer(player, 'doubles');
            }
        }
        
        // Delete profile button
        if (e.target.closest('.btn-delete-profile')) {
            const email = e.target.closest('.btn-delete-profile').getAttribute('data-email');
            const player = centralObj.players.find(p => p.email === email);
            if (player) {
                await deletePlayer(player);
            }
        }

        if (e.target.closest('.btn-delete')) {
            const row = e.target.closest('tr');
            const matchIndex = Array.from(row.parentNode.children).indexOf(row);
            const match = centralObj.allMatches[matchIndex];
            
            if (match) {
                await handleMatchDelete(match);
            }
        }
    });





    const addRefereeBtn = document.getElementById('addRefereeBtn');
    const refereeForm = document.getElementById('refereeForm');
    const cancelReferee = document.getElementById('cancelReferee');
    const submitReferee = document.getElementById('submitReferee');
    const togglePassword = document.getElementById('togglePassword');
    const refereePassword = document.getElementById('refereePassword');
    const refereeConfirmationModal = document.getElementById('refereeConfirmationModal');
    const cancelRefereeCreation = document.getElementById('cancelRefereeCreation');
    const confirmRefereeCreation = document.getElementById('confirmRefereeCreation');
    const refereeDetails = document.getElementById('refereeDetails');

            // Toggle referee form visibility
    addRefereeBtn.addEventListener('click', function() {
        refereeForm.style.display = refereeForm.style.display === 'none' ? 'block' : 'none';
    });

    cancelReferee.addEventListener('click', function() {
        refereeForm.style.display = 'none';
        clearRefereeForm();
    });

            // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = refereePassword.getAttribute('type') === 'password' ? 'text' : 'password';
        refereePassword.setAttribute('type', type);
                
                // Toggle eye icon
        const eyeIcon = togglePassword.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });

            // Submit referee form
    submitReferee.addEventListener('click', function() {
        const name = document.getElementById('refereeName').value.trim();
        const refEmail = document.getElementById('refereeEmail').value.trim();
        const password = refereePassword.value.trim();
        const phone = document.getElementById('refereePhone').value.trim();
                
        if (!name || !refEmail || !password) {
            alert('Please fill in all fields');
            return;
        }
                
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if(!refEmail.endsWith('@pccoepune.org')){
            alert('Please enter a valid PCCOE email address.');
            return;
        }
                
                // Show confirmation modal with referee details
        refereeDetails.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${refEmail}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Password:</strong> ${'*'.repeat(password.length)}</p>
        `;
                
        refereeConfirmationModal.classList.add('active');
    });

            // Cancel referee creation
    cancelRefereeCreation.addEventListener('click', function() {
        refereeConfirmationModal.classList.remove('active');
    });

            // Confirm referee creation
    confirmRefereeCreation.addEventListener('click',async function() {
        try {
            const name = document.getElementById('refereeName').value.trim();
            const refEmail = document.getElementById('refereeEmail').value.trim();
            const password = refereePassword.value.trim();
            const phone = `${document.getElementById('refereePhone').value.trim()}`;
                    // Create referee object
            const referee = {
                name,
                refEmail,
                phone,
                password,
            };
                    
                    
            // console.log('Creating new referee:', referee);
            const response = await fetch('/dashboard/add-refree', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(referee)
            });

            const data = await response.json();
            if(data.success){
                addRefereeToTable(referee);
                    
                    
                refereeConfirmationModal.classList.remove('active');
                refereeForm.style.display = 'none';
                clearRefereeForm();
                alert(data.message);
            }else{
                alert(data.message);
            }
            
        } catch (error) {
            console.log(error);
        }
    });

            // Function to add referee to the table
    function addRefereeToTable(referee) {
        const tbody = document.getElementById('refereesList');
        const tr = document.createElement('tr');
                
        tr.innerHTML = `
            <td>${referee.name}</td>
            <td>${referee.refEmail}</td>
            <td>${referee.phone}</td>
        `;
                
        tbody.appendChild(tr);
    }

            // Function to clear the referee form
    function clearRefereeForm() {
        document.getElementById('refereeName').value = '';
        document.getElementById('refereeEmail').value = '';
        refereePassword.value = '';
        refereePassword.setAttribute('type', 'password');
            
                // Reset eye icon
        const eyeIcon = togglePassword.querySelector('i');
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }    
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
    // if (item.classList.contains('logout-btn')) return;

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
// const logoutBtn = document.querySelector('.logout-btn');
// const logoutModal = document.getElementById('logoutModal');
// const cancelLogout = document.getElementById('cancelLogout');
// const confirmLogout = document.getElementById('confirmLogout');

// logoutBtn.addEventListener('click', function () {
//     logoutModal.classList.add('active');
// });

// cancelLogout.addEventListener('click', function () {
//     logoutModal.classList.remove('active');
// });

// confirmLogout.addEventListener('click', function () {
//     // Redirect or perform logout logic here
//     alert('Logging out...');
//     logoutModal.classList.remove('active');
// });

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});



// Generate Schedule functionality
document.getElementById('generateSchedule').addEventListener('click', function() {
    document.getElementById('generateScheduleModal').classList.add('active');
});

document.getElementById('cancelSchedule').addEventListener('click', function() {
    document.getElementById('generateScheduleModal').classList.remove('active');
});

// Category selection
const categoryCards = document.querySelectorAll('.category-card');
const nextButton = document.getElementById('nextSchedule');
let selectedCategory = null;

categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove selected class from all cards
        categoryCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        this.classList.add('selected');
        
        // Enable next button
        nextButton.removeAttribute('disabled');
        
        // Store selected category
        selectedCategory = this.getAttribute('data-category');
    });
});

function calculateRegistrationCounts() {
    const boysSinglesCount = centralObj.players.filter(player => 
        player.gender === 'Male' && player.singles
    ).length;
    
    const girlsSinglesCount = centralObj.players.filter(player => 
        player.gender === 'Female' && player.singles
    ).length;
    
    const boysDoublesCount = centralObj.players.filter(player => 
        player.gender === 'Male' && player.doubles
    ).length;
    
    const girlsDoublesCount = centralObj.players.filter(player => 
        player.gender === 'Female' && player.doubles
    ).length;
    
    // Update the count badges
    document.getElementById('boysSinglesCount').innerHTML = 
        `<i class="fas fa-male"></i><span>BS: ${boysSinglesCount}</span>`;
    
    document.getElementById('girlsSinglesCount').innerHTML = 
        `<i class="fas fa-female"></i><span>GS: ${girlsSinglesCount}</span>`;
    
    document.getElementById('boysDoublesCount').innerHTML = 
        `<i class="fas fa-male"></i><i class="fas fa-male"></i><span>BD: ${boysDoublesCount}</span>`;
    
    document.getElementById('girlsDoublesCount').innerHTML = 
        `<i class="fas fa-female"></i><i class="fas fa-female"></i><span>GD: ${girlsDoublesCount}</span>`;
}




// Next button functionality
nextButton.addEventListener('click', async function() {
    try {
        if (selectedCategory) {
            let data1 = '';
            if(selectedCategory == 'Boys Singles'){
                data1 = 'BS';
            }else if(selectedCategory == 'Girls Singles'){
                data1 = 'GS';
            }else if(selectedCategory == 'Boys Doubles'){
                data1 = 'BD';
            }else{
                data1 = 'GD';
            }

            const response = await fetch('/dashboard/save-shedule-type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data1})
            });

            const data = await response.json();

            if(data.success){
                window.location.href = '/shedule';
            }else{
                alert('Not save the shedule type.')
            }
        }
    } catch (error) {
        alert(error);
        console.log(error);
    }
});

// Close modal when clicking outside or on close button
document.querySelector('#generateScheduleModal .close-modal').addEventListener('click', function() {
    document.getElementById('generateScheduleModal').classList.remove('active');
});



// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .fade-in-left {
        animation: fadeInLeft 0.5s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Update menu toggle to add animation
menuToggle.addEventListener('click', function () {
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        sidebar.style.animation = 'slideInLeft 0.3s ease-out';
    }
});

// Add slide animation for sidebar
const sidebarStyle = document.createElement('style');
sidebarStyle.textContent = `
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(sidebarStyle);

function filterPlayers() {
    const branchFilter = document.getElementById('branchFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    
    const playerRows = document.querySelectorAll('#playerSectionTbody tr');
    
    playerRows.forEach((row, index) => {
        const branch = row.cells[3].textContent;
        const year = row.cells[4].textContent;
        const category = row.cells[5].textContent;
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
        
        // Apply category filter
        if (categoryFilter !== 'all' && !category.includes(categoryFilter)) {
            showRow = false;
        }
        
        // Apply search filter
        if (searchTerm && !name.includes(searchTerm) && !email.includes(searchTerm)) {
            showRow = false;
        }
        
        if (showRow) {
            row.style.display = '';
            // Add animation when showing
            row.style.animation = `fadeInLeft 0.3s ease-out ${index * 0.05}s forwards`;
        } else {
            row.style.display = 'none';
        }
    });
}