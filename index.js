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
let oHasWon;

let patternsCopy;

let cpuIndex;
let cpuPattern;
let cpuPatternCopy;
let cpuPatternCount;

let changeBlock;

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

function roundStart(){
    turn = "x";
    xPattern = [];
    oPattern = [];
    clickCount = 0;
    availableClicks = 9;
    pvpRoundWinner = null;
    oHasWon = false;
    xHasWon = false;
    // Start Game
    xScorePvp = 0;
    oScorePvp = 0;
    tieScorePvp = 0;

    mainMenu.style.display = "none";
    pvpScreen.style.display = "flex";
    patternsCopy = patterns.slice();
}

function findCpuPattern(){
    if (patternsCopy.length != 0){
        cpuIndex = Math.floor(Math.random() * patternsCopy.length);
        cpuPattern = patternsCopy[cpuIndex];
        cpuPatternCopy = cpuPattern.slice();
    }
}

function checkCpuPattern(){
    console.log("Cpu Pattern is: " + cpuPatternCopy)
    console.log(patternsCopy)
    for (let elem of cpuPattern){

        if (activePlayerValue == "x"){
            if (document.getElementById(elem).getAttribute('taken') != "x"){
                ++cpuPatternCount;
            }
        } else if (activePlayerValue == "o"){
            if (document.getElementById(elem).getAttribute('taken') != "o"){
                ++cpuPatternCount;
            }
        }

    }
    if (patternsCopy.length != 0){

    
        if (cpuPatternCount < cpuPattern.length){
            console.log(patternsCopy)
            cpuPatternCount = 0;
            console.log("Removed: " + patternsCopy[cpuIndex])
            patternsCopy.splice(cpuIndex, 1);

            findCpuPattern();
            checkCpuPattern();
            
        }
    }
    cpuPatternCount = 0;
}

function cpuMove(){
    if (activePlayerValue == "x"){
        if (turn == "o" && clickCount % 2 != 0){
            if (patternsCopy.length != 0){

            
                checkCpuPattern();
            // for (let block of pvpBlocks){
                // if (block.getAttribute('coordinate') == cpuPatternCopy[0]){
                    
                    for (let i = cpuPatternCopy.length - 1; i >= 0; i--){
                        if (document.getElementById(cpuPatternCopy[i]).getAttribute('state') == 'empty'){
                            changeBlock = document.getElementById(cpuPatternCopy[i]);        
                        }
                    }

                    // if (patternsCopy.length == 0){
                    //     changeBlock = document.querySelector('[state="empty"]');
                    // }
                    
                    if (changeBlock.getAttribute('state') == "empty"){
                        changeBlock.setAttribute('state', 'busy');
                        changeBlock.setAttribute('taken', 'o');
                        changeBlock.children[3].classList.remove('hovered');                    
                        changeBlock.children[1].classList.add('hovered');
                        changeTextO();
                        turn = "x"
                        ++clickCount;
                        // Collect coordinate
                        oPattern.push(changeBlock.getAttribute('coordinate'));
                        // Check state
                        if (clickCount >= 5){
                            checkO();
                        }
                        availableClicks--;
                        if (availableClicks == 0 && pvpRoundWinner == null){
                            roundTie();
                        }
                        cpuPatternCopy.shift();
                        changeBlock = null;
                    }

                // }
            // }
            } else if (patternsCopy.length == 0) {
                changeBlock = document.querySelector('[state="empty"]');
                if (changeBlock.getAttribute('state') == "empty"){
                    changeBlock.setAttribute('state', 'busy');
                    changeBlock.setAttribute('taken', 'o');
                    changeBlock.children[3].classList.remove('hovered');                    
                    changeBlock.children[1].classList.add('hovered');
                    changeTextO();
                    turn = "x"
                    ++clickCount;
                    // Collect coordinate
                    oPattern.push(changeBlock.getAttribute('coordinate'));
                    // Check state
                    if (clickCount >= 5){
                        checkO();
                    }
                    availableClicks--;
                    if (availableClicks == 0 && pvpRoundWinner == null){
                        roundTie();
                    }
                    cpuPatternCopy.shift();
                    changeBlock = null;
                }
            }
        }
    } else if (activePlayerValue == "o"){
        if (turn == "x" && clickCount % 2 == 0){
            if (patternsCopy.length != 0){

            
                checkCpuPattern();
            // for (let block of pvpBlocks){
            //     if (block.getAttribute('coordinate') == cpuPatternCopy[0]){
                    

                    for (let i = cpuPatternCopy.length - 1; i >= 0; i--){
                        if (document.getElementById(cpuPatternCopy[i]).getAttribute('state') == 'empty'){
                            changeBlock = document.getElementById(cpuPatternCopy[i]);        
                        }
                    }

                    if (changeBlock.getAttribute('state') == "empty"){
                        changeBlock.setAttribute('state', 'busy');
                        changeBlock.setAttribute('taken', 'x');
                        changeBlock.children[2].classList.remove('hovered');
                        changeBlock.children[0].classList.add('hovered');
                        changeTextX();
                        turn = "o"
                        ++clickCount;
                        // Collect coordinate
                        xPattern.push(changeBlock.getAttribute('coordinate'));
                        // Check State
                        if (clickCount >= 5){
                            checkX();
                        }
                        availableClicks--;
                        if (availableClicks == 0 && pvpRoundWinner == null){
                            roundTie();
                        }
                        cpuPatternCopy.shift();
                        changeBlock = null;
                    }

            //     }
            // } 
            } else if (patternsCopy.length == 0){
                changeBlock = document.querySelector('[state="empty"]');
                if (changeBlock.getAttribute('state') == "empty"){
                    changeBlock.setAttribute('state', 'busy');
                    changeBlock.setAttribute('taken', 'x');
                    changeBlock.children[2].classList.remove('hovered');
                    changeBlock.children[0].classList.add('hovered');
                    changeTextX();
                    turn = "o"
                    ++clickCount;
                    // Collect coordinate
                    xPattern.push(changeBlock.getAttribute('coordinate'));
                    // Check State
                    if (clickCount >= 5){
                        checkX();
                    }
                    availableClicks--;
                    if (availableClicks == 0 && pvpRoundWinner == null){
                        roundTie();
                    }
                    cpuPatternCopy.shift();
                    changeBlock = null;
                }
            }
        }
    }
}

function pvcStart(){
    pvpBlocks = document.getElementById('pvp-gamepad-blocks').children;
    roundStart();
    findCpuPattern();
    cpuPatternCount = 0;

    for (let block of pvpBlocks){
        // Hovering Blocks
        block.addEventListener('mouseover', () => {
            if (block.getAttribute('state') == "empty") {
                if (activePlayerValue == "x" && turn == "x"){
                    block.children[2].classList.add('hovered');
                } else if (activePlayerValue == "o"&& turn == "o") {
                    block.children[3].classList.add('hovered');
                }
            }
        })
        block.addEventListener('mouseout', () => {
            if (block.getAttribute('state') == "empty") {
                if (activePlayerValue == "x" && turn == "x"){
                    block.children[2].classList.remove('hovered');
                } else if (activePlayerValue == "o"&& turn == "o") {
                    block.children[3].classList.remove('hovered');
                }
            }
        })
        block.addEventListener('click', function(){
            if (block.getAttribute('state') == "empty") {
                if (activePlayerValue == "x" && turn == "x") {
                    block.setAttribute('state', 'busy');
                    block.setAttribute('taken', 'x');
                    block.children[2].classList.remove('hovered');
                    block.children[0].classList.add('hovered');
                    changeTextX();
                    turn = "o"
                    ++clickCount;
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
                    if (!xHasWon) {
                        cpuMove();
                    }
                } else if (activePlayerValue == "o" && turn == "o") {
                    block.setAttribute('state', 'busy');
                    block.setAttribute('taken', 'o');
                    block.children[3].classList.remove('hovered');                    
                    block.children[1].classList.add('hovered');
                    changeTextO();
                    turn = "x"
                    ++clickCount;
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
                    if (!oHasWon){
                        cpuMove();
                    }
                }   
            }
        })
    }

    if (activePlayerValue == "o"){
        cpuMove();
    }
    

    // Player Names
    if (activePlayerValue == "x"){
        document.getElementById("pvp-player-x").textContent += " (p1)";
        document.getElementById("pvp-player-o").textContent += " (CPU)";
    } else if (activePlayerValue == "o"){
        document.getElementById("pvp-player-x").textContent += " (CPU)";
        document.getElementById("pvp-player-o").textContent += " (p1)";
    }


    
}

function pvpStart(){
    roundStart();
    
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
                    block.setAttribute('taken', 'x');
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
                    block.setAttribute('taken', 'o');
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
            if (!oHasWon) {
                oTakesRound();
                oHasWon = true;
            }
            
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
    turn = "x";
    xPattern = [];
    oPattern = [];
    clickCount = 0;
    availableClicks = 9;
    pvpRoundWinner = null;
    xHasWon = null;
    oHasWon = null;
    changeTextO();
    for (let block of pvpBlocks){
        block.children[0].classList.remove('hovered');
        block.children[1].classList.remove('hovered');
        block.setAttribute('state', 'empty');
        block.setAttribute('taken', 'none');
    }
    document.getElementById('-x-takes').style.display = "block";
    document.getElementById('-o-takes').style.display = "block";
    findCpuPattern();
    cpuPatternCount = 0
    removeHighlight();
    
    // patternsCopy = patterns.slice();
    if (activePlayerValue == "o"){
        cpuMove();
    }
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