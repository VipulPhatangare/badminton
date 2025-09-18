/**
 * Badminton Scorecard Script
 * - Fixed settings: 15 points, Player 1 serves first, 3 sets to win
 * - Service logic: rally winner becomes server
 * - Deuce/Advantage logic: at 14-14, need 2-point lead
 * - Set history tracking
 * - Mobile responsive design
 */

/* -------------------------
   Config & State
   ------------------------- */
const state = loadGameState() || {
    maxPoints: 15,          // Fixed at 15 points
    maxSetsToWin: 3,        // Fixed at 3 sets to win match
    currentSet: 0,          // 0 means no set started yet
    scores: [0, 0],
    setsWon: [0, 0],
    setHistory: [[], []],   // Store score for each set won by each player
    server: 0,              // Player 1 serves first by default
    initialServer: 0,       // Fixed to Player 1
    isMatchActive: false,
    lastActions: [],        // for undo (stack of {player, action, prevScores, prevState})
    matchNumber: 1,         // Track match number
    setResults: [],         // Store set results with set number and scores
};

// Load game state from session storage
function loadGameState() {
    const savedState = sessionStorage.getItem('badmintonGameState');
    return savedState ? JSON.parse(savedState) : null;
}

// Save game state to session storage
function saveGameState() {
    sessionStorage.setItem('badmintonGameState', JSON.stringify(state));
}

/* -------------------------
   Cached DOM nodes
   ------------------------- */
const scoreEls = [document.getElementById('score0'), document.getElementById('score1')];
const setsEls = [document.getElementById('sets0'), document.getElementById('sets1')];
const advEls = [document.getElementById('advBadge0'), document.getElementById('advBadge1')];
const playerCards = [document.getElementById('player0'), document.getElementById('player1')];
const flashEls = [document.getElementById('flash0'), document.getElementById('flash1')];
// const setHistoryEls = [document.getElementById('setHistory0'), document.getElementById('setHistory1')];

const currentSetEl = document.getElementById('currentSetDisplay');
const displayMaxPointsEl = document.getElementById('displayMaxPoints');
const displayMaxSetsEl = document.getElementById('displayMaxSets');
const initialServerIndicatorEl = document.getElementById('initialServerIndicator');
const matchNumberEl = document.getElementById('matchNumber');
const setStartBtn = document.getElementById('setStartBtn');
const setStartContainer = document.getElementById('setStartContainer');
const setNumberIndicator = document.getElementById('setNumberIndicator');
const setConfirmation = document.getElementById('setConfirmation');
const confirmSetNumber = document.getElementById('confirmSetNumber');
const confirmSetNumberText = document.getElementById('confirmSetNumberText');
const setConfirmBtn = document.getElementById('setConfirmBtn');
const setCancelBtn = document.getElementById('setCancelBtn');

const toggleServeBtn = document.getElementById('toggleServeBtn');
const resetMatchBtn = document.getElementById('resetMatchBtn');
const undoBtn = document.getElementById('undoBtn');
const undoContainer = document.getElementById('undoContainer');

const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlayClose');
const winnerText = document.getElementById('winnerText');
const winnerTitle = document.getElementById('winnerTitle');

const setWinsContainer = document.getElementById('setWinsContainer');
const setWinsList = document.getElementById('setWinsList');

/* -------------------------
   Utility Helpers
   ------------------------- */
function clamp(value, min=0, max=9999){ return Math.max(min, Math.min(max, value)); }
function animateScore(index){
    const el = scoreEls[index];
    el.classList.add('anim');
    setTimeout(()=>el.classList.remove('anim'), 200);
}
function showFlash(index){
    const f = flashEls[index];
    f.classList.add('show');
    setTimeout(()=>f.classList.remove('show'), 900);
}
function updateServerUI(){
    if (state.currentSet === 0) {
        playerCards.forEach(card => card.classList.remove('serving'));
        return;
    }
    
    playerCards.forEach((card, idx)=>{
        if(idx === state.server) {
            card.classList.add('serving');
        } else {
            card.classList.remove('serving');
        }
    });
}

// function updateSetHistory() {
//     for (let i = 0; i < 2; i++) {
//         setHistoryEls[i].innerHTML = '';
//         state.setHistory[i].forEach(score => {
//             const setItem = document.createElement('div');
//             setItem.className = 'set-item';
//             setItem.textContent = score;
//             setHistoryEls[i].appendChild(setItem);
//         });
//     }
// }

function updateSetUI() {
    if (state.currentSet === 0) {
        currentSetEl.textContent = '-';
        setStartContainer.style.display = 'block';
        setNumberIndicator.textContent = '1';
        document.querySelectorAll('.btn[data-action="inc"]').forEach(btn => {
            btn.disabled = true;
        });
        toggleServeBtn.disabled = true;
        undoContainer.style.display = 'none';
        setWinsContainer.style.display = 'none';
    } else {
        currentSetEl.textContent = state.currentSet;
        setStartContainer.style.display = 'none';
        document.querySelectorAll('.btn[data-action="inc"]').forEach(btn => {
            btn.disabled = false;
        });
        toggleServeBtn.disabled = false;
        undoContainer.style.display = 'flex';
        setWinsContainer.style.display = 'block';
    }
}

function updateSetWinsDisplay() {
    setWinsList.innerHTML = '';
    
    if (state.setResults.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'No sets completed yet';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.color = '#999';
        setWinsList.appendChild(emptyMsg);
        return;
    }
    
    state.setResults.forEach(result => {
        const setWinItem = document.createElement('div');
        setWinItem.className = 'set-win-item';
        
        const setInfo = document.createElement('div');
        setInfo.textContent = `Set ${result.setNumber}`;
        
        const scoreInfo = document.createElement('div');
        scoreInfo.textContent = `${result.winnerName} won ${result.score}`;
        scoreInfo.style.fontWeight = '600';
        
        setWinItem.appendChild(setInfo);
        setWinItem.appendChild(scoreInfo);
        setWinsList.appendChild(setWinItem);
    });
}

/* -------------------------
   Core Game Logic
   ------------------------- */

// start or reset for new match
function startMatch(){
    state.currentSet = 0;
    state.scores = [0,0];
    state.setsWon = [0,0];
    state.setHistory = [[], []];
    state.server = state.initialServer;
    state.isMatchActive = true;
    state.lastActions = [];
    state.matchNumber++;
    state.setResults = [];
    updateAllUI();
}

// full reset
function fullReset(){
    state.matchNumber = 1;
    startMatch();
    hideOverlay();
}

// Start a new set
function startNewSet() {
    if (state.currentSet === 0) {
        state.currentSet = 1;
    }
    state.scores = [0, 0];
    updateAllUI();
}

/**
 * Add a point to player (0 or 1). Handles:
 *  - Rally winner becomes server
 *  - Deuce / advantage logic and determining set winner
 */
function addPointToPlayer(pIndex){
    if(!state.isMatchActive || state.currentSet === 0) return;
    const other = 1 - pIndex;

    // Save snapshot for undo
    state.lastActions.push({
        type: 'point',
        player: pIndex,
        prev: {
            scores: [...state.scores],
            setsWon: [...state.setsWon],
            currentSet: state.currentSet,
            server: state.server,
            setHistory: JSON.parse(JSON.stringify(state.setHistory)),
            setResults: JSON.parse(JSON.stringify(state.setResults))
        }
    });

    // Rally winner serves next
    state.server = pIndex;

    // Add point
    state.scores[pIndex] = clamp(state.scores[pIndex] + 1, 0, 9999);
    animateScore(pIndex);

    // Evaluate set-winning
    evaluateSetState();
    updateAllUI();
}

/**
 * Evaluate set conditions after a point change.
 * - Normal win: reaches maxPoints and opponent < maxPoints - 1
 * - Deuce region: if both >= maxPoints - 1, need 2 point lead
 */
function evaluateSetState(){
    const m = state.maxPoints;
    const [a, b] = state.scores;
    const lead = Math.abs(a - b);

    // Determine if we are in deuce region
    const deuceThreshold = m - 1;
    let setWonBy = null;

    if(a >= m || b >= m){
        // If both below deuce threshold, simple winner
        if(a >= m && a - b >= 2) setWonBy = 0;
        if(b >= m && b - a >= 2) setWonBy = 1;

        // If both reached deuceThreshold (e.g., 14) -> still require 2 lead
        if(a >= deuceThreshold && b >= deuceThreshold){
            if(lead >= 2){
                setWonBy = a > b ? 0 : 1;
            } else {
                // show advantage when lead ==1
                if(lead === 1){
                    showAdvantage(a > b ? 0 : 1);
                } else {
                    hideAdvantages();
                }
            }
        } else {
            // Not both reached deuce threshold: if someone reached m and opponent <= m-2 OR lead >=2
            if(a >= m && a - b >= 2) setWonBy = 0;
            if(b >= m && b - a >= 2) setWonBy = 1;
            hideAdvantages();
        }
    } else {
        hideAdvantages();
    }

    if(setWonBy !== null){
        handleSetWin(setWonBy);
    }
}

/**
 * Handle a player winning the set.
 * - Record set score
 * - Increment setsWon
 * - If match won (setsWon >= maxSetsToWin) show overlay
 * - Reset scores for next set, increment currentSet
 * - Server: keep as the winner (they were last rally winner)
 */
function handleSetWin(winnerIndex){
    const loserIndex = 1 - winnerIndex;
    const winnerName = document.getElementById(`name${winnerIndex}`).textContent.trim() || `Player ${winnerIndex + 1}`;
    const score = `${state.scores[winnerIndex]}-${state.scores[loserIndex]}`;
    
    // Record the set result
    state.setResults.push({
        setNumber: state.currentSet,
        winnerIndex: winnerIndex,
        winnerName: winnerName,
        score: score
    });
    
    // Record the set score in history
    state.setHistory[winnerIndex].push(score);
    
    state.setsWon[winnerIndex] += 1;
    // Flash their panel
    showFlash(winnerIndex);

    // Save action for undo
    state.lastActions.push({
        type: 'set-win',
        player: winnerIndex,
        prev: {
            scores: [ ...state.scores ],
            setsWon: [ ...state.setsWon ].map((s,i)=> i===winnerIndex ? s-1 : s),
            currentSet: state.currentSet,
            server: state.server,
            setHistory: JSON.parse(JSON.stringify(state.setHistory)),
            setResults: JSON.parse(JSON.stringify(state.setResults))
        }
    });

    // Save state to session storage
    saveGameState();

    // Check match winner
    // If player has won 2 sets (out of 3), they win the match
    if(state.setsWon[winnerIndex] >= 2){
        // Match ends
        state.isMatchActive = false;
        updateAllUI();
        showMatchWinner(winnerIndex);
        return;
    }

    // Show set completion popup
    showSetCompletionPopup(winnerIndex);

    // UI update
    updateAllUI();
}

/* Advantage display helpers */
function showAdvantage(index){
    advEls[index].style.display = 'inline-block';
    advEls[1-index].style.display = 'none';
}
function hideAdvantages(){
    advEls.forEach(e => e.style.display = 'none');
}

/* Undo functionality */
function undoLastAction() {
    if (state.lastActions.length === 0) return;
    
    const lastAction = state.lastActions.pop();
    const prev = lastAction.prev;
    
    // Restore previous state
    state.scores = prev.scores;
    state.setsWon = prev.setsWon;
    state.currentSet = prev.currentSet;
    state.server = prev.server;
    state.setHistory = prev.setHistory;
    state.setResults = prev.setResults;
    
    // If we're undoing the first action of a set, we might need to reactivate the match
    if (state.currentSet > 0) {
        state.isMatchActive = true;
    }
    
    updateAllUI();
}

/* -------------------------
   UI Update logic
   ------------------------- */
function updateAllUI(){
    // scores
    scoreEls.forEach((el, idx) => {
        el.textContent = state.scores[idx];
    });

    // sets
    setsEls.forEach((el, idx) => {
        el.textContent = state.setsWon[idx];
    });

    // match number
    matchNumberEl.textContent = state.matchNumber;
    
    displayMaxPointsEl.textContent = state.maxPoints;
    displayMaxSetsEl.textContent = state.maxSetsToWin;
    initialServerIndicatorEl.textContent = document.getElementById('name0').textContent.trim() || 'Player 1';
    updateServerUI();
    // updateSetHistory();
    updateSetUI();
    updateSetWinsDisplay();

    // Enable/disable undo button
    undoBtn.disabled = state.lastActions.length === 0;

    // If match inactive (because winner), indicate visually
    if(!state.isMatchActive){
        document.querySelectorAll('.btn[data-action="inc"]').forEach(btn=>{
            btn.disabled = true;
        });
        toggleServeBtn.disabled = true;
    }
}

/* -------------------------
   Overlay / Winner UI
   ------------------------- */
function showMatchWinner(winnerIdx){
    winnerTitle.textContent = 'Match Winner';
    const name = document.getElementById(`name${winnerIdx}`).textContent.trim() || `Player ${winnerIdx+1}`;
    winnerText.innerHTML = `<strong>${name}</strong> wins the match (${state.setsWon[winnerIdx]} - ${state.setsWon[1-winnerIdx]})`;
    
    // Generate match summary
    const summaryHTML = generateMatchSummary();
    document.getElementById('matchSummary').innerHTML = summaryHTML;
    
    overlay.classList.remove('hidden');
    saveGameState();
}

function hideOverlay(){
    overlay.classList.add('hidden');
}

function generateMatchSummary() {
    let html = '<div class="summary-container">';
    html += '<h3>Match Summary</h3>';
    
    state.setResults.forEach(result => {
        html += `
            <div class="summary-row">
                <span>Set ${result.setNumber}</span>
                <span>${result.winnerName} won (${result.score})</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function showSetCompletionPopup(winnerIndex) {
    const setCompletionOverlay = document.getElementById('setCompletionOverlay');
    const setCompletionText = document.getElementById('setCompletionText');
    const winnerName = document.getElementById(`name${winnerIndex}`).textContent.trim() || `Player ${winnerIndex + 1}`;
    
    setCompletionText.innerHTML = `<strong>${winnerName}</strong> won Set ${state.currentSet}!`;
    
    // Show current match status in the summary
    const summaryHTML = `
        <div class="set-summary-details">
            <p>Match Score: ${state.setsWon[0]} - ${state.setsWon[1]}</p>
            <p>Set Score: ${state.scores[winnerIndex]}-${state.scores[1-winnerIndex]}</p>
        </div>
    `;
    document.getElementById('setCompletionSummary').innerHTML = summaryHTML;
    
    setCompletionOverlay.classList.remove('hidden');
    saveGameState();
}

function showSetConfirmation() {
    state.isMatchActive = true;
    confirmSetNumber.textContent = state.currentSet + 1;
    confirmSetNumberText.textContent = state.currentSet + 1;
    setConfirmation.classList.remove('hidden');
}

function hideSetConfirmation() {
    setConfirmation.classList.add('hidden');
}

/* -------------------------
   Event Listeners
   ------------------------- */

// inc buttons (event delegation)
document.addEventListener('click', (e)=>{
    const target = e.target.closest('[data-action]');
    if(!target) return;
    const action = target.dataset.action;
    const p = parseInt(target.dataset.player);
    if(action === 'inc') addPointToPlayer(p);
});

// set start button
setStartBtn.addEventListener('click', () => {
    showSetConfirmation();
});

// set confirmation buttons
setConfirmBtn.addEventListener('click', () => {
    hideSetConfirmation();
    startNewSet();
});

setCancelBtn.addEventListener('click', () => {
    hideSetConfirmation();
});

// toggle server manually
toggleServeBtn.addEventListener('click', ()=>{
    state.server = 1 - state.server;
    updateAllUI();
});

// full reset
resetMatchBtn.addEventListener('click', ()=>{
    if(confirm('Reset match to defaults?')) fullReset();
});

// undo button
undoBtn.addEventListener('click', undoLastAction);

// overlay close
overlayClose.addEventListener('click', hideOverlay);

// allow names to be edited and reflected
document.getElementById('name0').addEventListener('input', updateAllUI);
document.getElementById('name1').addEventListener('input', updateAllUI);

// Add event listener for complete match button
document.getElementById('completeMatchBtn').addEventListener('click', () => {
    if(confirm('Are you sure you want to complete this match? This will clear the match data.')) {
        sessionStorage.removeItem('badmintonGameState');
        fullReset();
    }
});

// Add event listener for start next set button
document.getElementById('startNextSetBtn').addEventListener('click', () => {
    document.getElementById('setCompletionOverlay').classList.add('hidden');
    state.currentSet += 1;
    state.scores = [0,0];
    state.isMatchActive = true;
    updateAllUI();
    saveGameState();
});

// When making any changes to the game state, save it
document.addEventListener('click', (e) => {
    const target = e.target;
    if(target.matches('[data-action="inc"]') || 
       target.id === 'toggleServeBtn' || 
       target.id === 'undoBtn') {
        setTimeout(saveGameState, 0);
    }
});

// Initialize the UI and load saved state
updateAllUI();