'use strict';
var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    isHint: false
}
var gLevel = {
    size: 4,
    mines: 2
};
var gGameInterval;
var gStartTime;
var gMineTimeout;
var gHintTimeout;
var gHintIdx;
var gMessageTimeout;
var gLooseSound = new Audio("./audio/loose.wav");
var gVicSound = new Audio("./audio/victory.wav");

function initGame() {
    zeroingElements();
    var elLevels = document.getElementById('levels')
    var arrayName = elLevels.options[elLevels.selectedIndex].text;
    if (arrayName === 'Easy') {
        gLevel.size = 4;
        gLevel.mines = 2;
    } else if (arrayName === 'Hard') {
        gLevel.size = 8;
        gLevel.mines = 12;
    } else if (arrayName === 'Extremley Hard') {
        gLevel.size = 12;
        gLevel.mines = 30;
    }
    buildBoard();
    renderMat(gBoard);
    console.log(gBoard);
}

function zeroingElements() {
    clearInterval(gGameInterval);
    gGame.isOn = true;
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = 'Game Time: 0 seconds';
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.lives = 3;
    document.querySelector('button').innerHTML = '&#128522';
    var elLives = document.querySelector('.lives span');
    elLives.innerHTML = gGame.lives;
    for (var i = 1; i < 4; i++) {
        var elHint = document.querySelector(`.hints.n${i}`);
        elHint.style.visibility = 'visible';
    }
}

function buildBoard() {
    gBoard = createMat(gLevel.size, gLevel.size);
    // placeMines(gBoard, gLevel.mines);
    // setMinesNegsCount(gBoard);
    return gBoard;
}
function placeOneMine(board) {
    var emptyCells = getEmptyCells(board);
    var randCellIdx = getRandomInteger(0, emptyCells.length)
    var mine = emptyCells[randCellIdx];
    gBoard[mine.i][mine.j].isMine = true;
}

function placeMines(board, numOfMines) {
    for (var i = 0; i < numOfMines; i++) {
        placeOneMine(board);
    }
}



function negsMineCount(cellI, cellJ, board) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) {
                negsCount++;
            }
        }
    }
    return negsCount;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j];
            currCell.minesAroundCount = negsMineCount(i, j, board);
        }
    }
}

function cellClicked(cellI, cellJ) {
    if (!gGame.isOn) return;
    clearTimeout(gHintTimeout);
    clearTimeout(gMessageTimeout);
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    if (gGame.isHint) {
        var elHint = document.querySelector(`.hints.${gHintIdx}`);
        elHint.style.visibility = 'hidden';
        elHint.style.color = 'white';
        seeHint(cellI, cellJ);
        return;
    }
    while (gBoard[cellI][cellJ].isShown === false) {
        if (gBoard[cellI][cellJ].isMarked) return;
        if (gBoard[cellI][cellJ].isMine) {
            elCell.innerHTML = '&#128163';
            // gBoard[cellI][cellJ].isShown = true;
            gMineTimeout = setTimeout(disapearMine, 500, cellI, cellJ)
            gGame.lives--;
            var elLives = document.querySelector('.lives span');
            elLives.innerHTML = gGame.lives;
            checkGameLost();
            return;
        }
        else {
            if (gGame.shownCount === 0) {
                gStartTime = Date.now();
                gGameInterval = setInterval(updateCurrTime, 1000);
                gBoard[cellI][cellJ].isShown = true;
                placeMines(gBoard, gLevel.mines);
                setMinesNegsCount(gBoard);
            }
            gBoard[cellI][cellJ].isShown = true;
            elCell.innerHTML = gBoard[cellI][cellJ].minesAroundCount;
            gGame.shownCount++;
            if (gBoard[cellI][cellJ].minesAroundCount === 0) {
                expandShown(gBoard, cellI, cellJ);
            }
        }
    }
    checkGameOver();
    console.log(gGame.shownCount + gGame.markedCount);
    clearTimeout(gMineTimeout);
}

function checkGameLost() {
    if (gGame.lives === 0) {
        gLooseSound.play();
        clearTimeout(gMineTimeout);
        document.querySelector('button').innerHTML = '&#128557 You Lost!';
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var currCell = gBoard[i][j];
                if (currCell.isMine) {
                    var elCell = document.querySelector(`#cell-${i}-${j}`);
                    elCell.innerHTML = '&#128163';
                }
            }
        }
        clearInterval(gGameInterval);
        gGame.isOn = false;
    }
}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gBoard.length ** 2) {
        gVicSound.play();
        document.querySelector('button').innerHTML = '&#128526 You won!';
        clearInterval(gGameInterval);
        gGame.isOn = false;
    }
}

function expandShown(board, cellI, cellJ) {
    var negs = getNegs(cellI, cellJ, board);
    for (var i = 0; i < negs.length; i++) {
        var currCell = negs[i];
        if (gBoard[currCell.i][currCell.j].isMine === false) {
            var elNeg = document.querySelector(`#cell-${currCell.i}-${currCell.j}`)
            elNeg.innerHTML = gBoard[currCell.i][currCell.j].minesAroundCount;
            if (gBoard[currCell.i][currCell.j].isShown === false) {
                gBoard[currCell.i][currCell.j].isShown = true;
                gGame.shownCount++;
            }
        }
    }
}

function updateCurrTime() {
    var currTime = Math.floor((Date.now() - gStartTime) / 1000);
    gGame.secsPassed = 'Game Time: ' + currTime + ' seconds';
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = gGame.secsPassed;
    return gGame.secsPassed;
}



function cellMarked(cellI, cellJ) {
    //Prevents the browser from opening right-click menu
    var el = document.querySelector('table');
    el.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        return false;
    }, false);
    // The function which is used isntead of right-click
    if (!gGame.isOn) return false;
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    if (!gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isMarked = true;
        elCell.innerHTML = '&#128681';
        gGame.markedCount++;
    } else {
        gBoard[cellI][cellJ].isMarked = false;
        elCell.innerHTML = '';
        gGame.markedCount--;
    }
    checkGameOver();
    return false;
}

function disapearMine(cellI, cellJ) {
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    elCell.innerHTML = '';
}

function seeHint(cellI, cellJ) {
    var negs = getNegs(cellI, cellJ, gBoard);
    negs.push({ i: cellI, j: cellJ });
    for (var i = 0; i < negs.length; i++) {
        var currCell = negs[i];
        var elNeg = document.querySelector(`#cell-${currCell.i}-${currCell.j}`)
        if (gBoard[currCell.i][currCell.j].isMine === false) {
            elNeg.innerHTML = gBoard[currCell.i][currCell.j].minesAroundCount;
        } else {
            elNeg.innerHTML = '&#128163';
        }
    }
    gGame.isHint = false;
    gHintTimeout = setTimeout(clearHint, 1000, cellI, cellJ);
}

function clearHint(cellI, cellJ) {
    var negs = getNegs(cellI, cellJ, gBoard);
    negs.push({ i: cellI, j: cellJ });
    for (var i = 0; i < negs.length; i++) {
        var currCell = negs[i];
        var elNeg = document.querySelector(`#cell-${currCell.i}-${currCell.j}`)
        if (!gBoard[currCell.i][currCell.j].isShown)
            elNeg.innerHTML = '';
    }
}

function turnOnHint(idx) {
    if (gGame.shownCount === 0){
        var elMessage = document.querySelector(`.message`);
        elMessage.innerHTML = 'Can\'t show hint before first click!';
        elMessage.style.visibility = 'visible';
        gMessageTimeout = setTimeout(turnOfmassage,1800);
    } else {
        gGame.isHint = true;
        var elHint = document.querySelector(`.hints.${idx}`);
        elHint.style.color = 'yellow';
        gHintIdx = idx;
    }
}

function turnOfmassage(){
    var elMessage = document.querySelector(`.message`);
    elMessage.style.visibility = 'hidden';
}






