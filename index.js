let mainMenu;
let pvpScreen;

let patterns;
let xPattern;
let oPattern;

let selectors;
let xSelector;
let oSelector;
let activePlayer;
let activePlayerValue;
let clickCount;
let availableClicks;

let playButtons;
let pvcButton;
let pvpButton;

let turn;
let pvpBlocks;

let xScorePvp;
let oScorePvp;
let tieScorePvp;
let pvpRoundWinner;

let roundOverlay;
let tieOverlay;

let xHasWon;

document.addEventListener('DOMContentLoaded', function(){
    mainMenu = document.getElementById('main-menu');
    pvpScreen = document.getElementById('pvp-screen');

    selectors = document.getElementById('selector').children;
    xSelector = document.getElementById('player-x');
    oSelector = document.getElementById('player-o');
    
    activePlayer = null;
    activePlayerValue = null;
    
    playButtons = document.getElementById('play-buttons').children;
    pvcButton = document.getElementById('pvc');
    pvpButton = document.getElementById('pvp');

    roundOverlay = document.getElementById('player-wins-background');
    tieOverlay = document.getElementById('tie-background');

    // Select Player
    for (let selector of selectors){
        selector.addEventListener('click', function(){
            if(activePlayer == null){
                activePlayer = selector;
                activePlayer.classList.remove('selector-passive');
                activePlayer.classList.add('selector-active');
                activePlayerValue = activePlayer.getAttribute('value');
                for (let button of playButtons){
                    button.classList.remove('disabled');
                }
            } else if (activePlayer != null && selector != activePlayer){
                activePlayer.classList.remove('selector-active');
                activePlayer.classList.add('selector-passive');
                activePlayer = null;
                activePlayer = selector;
                activePlayer.classList.remove('selector-passive');
                activePlayer.classList.add('selector-active');
                activePlayerValue = activePlayer.getAttribute('value');
                for (let button of playButtons){
                    button.classList.remove('disabled');
                }
            } else if (activePlayer != null && selector == activePlayer){
                activePlayer.classList.remove('selector-active');
                activePlayer.classList.add('selector-passive');
                activePlayer = null;
                activePlayerValue = null;
                for (let button of playButtons){
                    button.classList.add('disabled');
                }
            }
        })
    }

    patterns = [
        // Horizontal
        ["tl", "tm", "tr"],
        ["ml", "mm", "mr"],
        ["bl", "bm", "br"],
        // Vertival
        ["tl", "ml", "bl"],
        ["tm", "mm", "bm"],
        ["tr", "mr", "br"],
        // Diagonal
        ["tl", "mm", "br"],
        ["bl", "mm", "tr"]
    ]
})

function pvcStart(){
    alert("Oops, this stage is not ready yet!");
}

function pvpStart(){
    turn = "x";
    xPattern = [];
    oPattern = [];
    clickCount = 0;
    availableClicks = 9;
    pvpRoundWinner = null;
    xHasWon = false;
    // Start Game
    xScorePvp = 0;
    oScorePvp = 0;
    tieScorePvp = 0;

    mainMenu.style.display = "none";
    pvpScreen.style.display = "flex";
    
    // Player Names
    if (activePlayerValue == "x"){
        document.getElementById("pvp-player-x").textContent += " (p1)";
        document.getElementById("pvp-player-o").textContent += " (p2)";
    } else if (activePlayerValue == "o"){
        document.getElementById("pvp-player-x").textContent += " (p2)";
        document.getElementById("pvp-player-o").textContent += " (p1)";
    }

    // Dealing With Blocks
    pvpBlocks = document.getElementById('pvp-gamepad-blocks').children;
    
    for (let block of pvpBlocks){
        // Hovering Blocks
        block.addEventListener('mouseover', () => {
            if (block.getAttribute('state') == "empty") {
                if (turn == "x") {
                    block.children[2].classList.add('hovered');
                } else if (turn == "o") {
                    block.children[3].classList.add('hovered');
                }
            }
        })
        block.addEventListener('mouseout', () => {
            if (block.getAttribute('state') == "empty") {
                if (turn == "x") {
                    block.children[2].classList.remove('hovered');
                } else if (turn == "o") {
                    block.children[3].classList.remove('hovered');
                }
            }
        })

        // Clicking On The Blocks
        block.addEventListener('click', function(){
            if (block.getAttribute('state') == "empty") {
                if (turn == "x") {
                    block.setAttribute('state', 'busy');
                    block.children[2].classList.remove('hovered');
                    block.children[0].classList.add('hovered');
                    changeTextX();
                    turn = "o"
                    clickCount++;
                    // Collect coordinate
                    xPattern.push(block.getAttribute('coordinate'));
                    // Check State
                    if (clickCount >= 5){
                        checkX();
                    }
                    availableClicks--;
                    if (availableClicks == 0 && pvpRoundWinner == null){
                        roundTie();
                    }
                } else if (turn == "o") {
                    block.setAttribute('state', 'busy');
                    block.children[3].classList.remove('hovered');                    
                    block.children[1].classList.add('hovered');
                    changeTextO();
                    turn = "x"
                    clickCount++;
                    // Collect coordinate
                    oPattern.push(block.getAttribute('coordinate'));
                    // Check state
                    if (clickCount >= 5){
                        checkO();
                    }
                    availableClicks--;
                    if (availableClicks == 0 && pvpRoundWinner == null){
                        roundTie();
                    }
                }
            }
        })
    }
}

function changeTextX(){
    document.getElementById('turn-x').style.display = "none";
    document.getElementById('turn-o').style.display = "block";
}

function changeTextO(){
    document.getElementById('turn-o').style.display = "none";
    document.getElementById('turn-x').style.display = "block";
}

function checkX(){
    for (let pattern of patterns){
        if (pattern.every(element => xPattern.includes(element))) {
            if (!xHasWon) {
                xTakesRound();
                xHasWon = true;
            }
            break;
        }
    }
}

function checkO(){
    for (let pattern of patterns){
        if (pattern.every(element => oPattern.includes(element))) {
            oTakesRound();
        }
    }
}

function xTakesRound(){
    pvpRoundWinner = "x";
    xScorePvp++;
    if (activePlayerValue == "x") {
        // Overlay Design When X wins and P1 is X
        roundOverlay.style.display = "flex";
        document.getElementById('player-wins-header').textContent = "player 1 wins!"
        document.getElementById('-o-takes').style.display = "none";
        document.getElementById('player-takes-round').style.color = "#31C3BD";
    } else if (activePlayerValue == "o") {
        // Overlay Design When X wins and P1 is O
        roundOverlay.style.display = "flex";
        document.getElementById('player-wins-header').textContent = "player 2 wins!"
        document.getElementById('-o-takes').style.display = "none";
        document.getElementById('player-takes-round').style.color = "#31C3BD";      
    }
    document.getElementById('pvp-player-x-score').textContent = xScorePvp;
    highlightX();
}

function oTakesRound(){
    oScorePvp++;
    pvpRoundWinner = "o";
    if (activePlayerValue == "o") {
        // Overlay Design When O wins and P1 is O
        roundOverlay.style.display = "flex";
        document.getElementById('player-wins-header').textContent = "player 1 wins!";
        document.getElementById('-x-takes').style.display = "none";
        document.getElementById('player-takes-round').style.color = "#F2B137";
    } else if (activePlayerValue == "x") {
        // Overlay Design When O wins and P1 is X
        roundOverlay.style.display = "flex";
        document.getElementById('player-wins-header').textContent = "player 2 wins!";
        document.getElementById('-x-takes').style.display = "none";
        document.getElementById('player-takes-round').style.color = "#F2B137";      
    }
    document.getElementById('pvp-player-o-score').textContent = oScorePvp;
    highlightO();
}

function roundTie(){
    tieScorePvp++;
    tieOverlay.style.display = "flex";
    document.getElementById('pvp-ties-score').textContent = tieScorePvp;
}

function nextRound(){
    roundOverlay.style.display = "none";
    tieOverlay.style.display = "none";
    pvpRoundWinner = null;
    xHasWon = null;
    xPattern = [];
    oPattern = [];
    changeTextO();
    for (let block of pvpBlocks){
        block.children[0].classList.remove('hovered');
        block.children[1].classList.remove('hovered');
        block.setAttribute('state', 'empty');
    }
    turn = "x";
    document.getElementById('-x-takes').style.display = "block";
    document.getElementById('-o-takes').style.display = "block";
    availableClicks = 9;
    removeHighlight();
}

function refreshPage(){
    window.location.reload();
}

function highlightX(){
    for (let array of patterns){
        if (array.every(element => xPattern.includes(element))){
            for(let elm of array){
                document.getElementById(elm).style.backgroundColor = "#31C3BD";
                document.getElementById(elm).style.boxShadow = "0px 8px #118C87";
                document.getElementById(elm).children[0].classList.remove('hovered');
                document.getElementById(elm).children[4].classList.add('highlighted');
            }
        }
    }
}

function highlightO(){
    for (let array of patterns){
        if (array.every(element => oPattern.includes(element))){
            for(let elm of array){
                document.getElementById(elm).style.backgroundColor = "#F2B137";
                document.getElementById(elm).style.boxShadow = "0px 8px #CC8B13";
                document.getElementById(elm).children[1].classList.remove('hovered');
                document.getElementById(elm).children[5].classList.add('highlighted');
            }
        }
    }
}

function removeHighlight(){
    let highElements = Array.from(document.getElementsByClassName('highlighted'));
    for (let i = 0; i < highElements.length; i++) {
        let highElement = highElements[i];
        highElement.parentNode.style.backgroundColor = "#1F3641";
        highElement.parentNode.style.boxShadow = "0px 8px #10212A";
        highElement.classList.remove('highlighted');
    }
}