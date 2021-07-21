'use strict';
var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gGameInterval;
var gStartTime;
function initGame() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    buildBoard();
    renderMat(gBoard);
    console.log(gBoard);
}

function buildBoard() {
    gBoard = createMat(4, 4);
    placeMines(gBoard, 2);
    setMinesNegsCount(gBoard);
    return gBoard;
}
function placeOneMine(board) {
    var emptyCells = getEmptyCells(board);
    var randCellIdx = getRandomInteger(0, emptyCells.length)
    var mine = emptyCells[randCellIdx];
    gBoard[mine.i][mine.j].isMine = true;
}

function placeMines(board, numOfMines) {
    board[0][0].isMine = true;
    board[2][2].isMine = true;
    // for (var i = 0; i < numOfMines; i++) {
    //     placeOneMine(board);
    // }
}



function negsMineCount(cellI, cellJ, board) {
    debugger;
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine === true) {
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


function cellClicked(elBtn, cellI, cellJ) {
    if (gGame.shownCount === 0) {
        gStartTime = Date.now();
        gGameInterval = setInterval(updateCurrTime, 1000);
    }
    var e = window.event;
    if (e.button === 0) {
        var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
        while (gBoard[cellI][cellJ].isShown === false) {
            if (gBoard[cellI][cellJ].isMine === true) {
                elCell.innerText = 'Mine';
                gBoard[cellI][cellJ].isShown = true;
                gameLost();
                return;
            }
            else {
                elCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
                gBoard[cellI][cellJ].isShown = true;
                gGame.shownCount++;
                if (gBoard[cellI][cellJ].minesAroundCount === 0) {
                    expandShown(gBoard, cellI, cellJ);
                }
            }
        }
        checkGameOver();
    } else if (e.button === 2) {
        console.log("U pressed right");
    }
}
function gameLost() {
    document.querySelector('button').innerHTML = '&#128557';
}

function checkGameOver() {
    if (gGame.shownCount === (gBoard.length ** 2) - 2) {
        document.querySelector('button').innerHTML = '&#128526 You won!';
    }
}

function expandShown(board, cellI, cellJ) {
    debugger;
    var negs = getNegs(cellI, cellJ, board);
    for (var i = 0; i < negs.length; i++) {
        if (negs[i].isMine === false) {
            var currCell = negs[i]
            var elNeg = document.querySelector(`#cell-${currCell.i}-${currCell.j}`)
            elNeg.innerText = gBoard[currCell.i][currCell.j].minesAroundCount;
            gBoard[currCell.i][currCell.j].isShown = true;
            gGame.shownCount++;
        }
    }
    renderMat(gBoard);
}

function updateCurrTime() {
    var currTime = (Date.now() - gStartTime) / 1000;
    gGame.secsPassed = 'Game Time: ' + currTime + ' seconds';
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = gGame.secsPassed;
    elTimer.style.display = 'block';
    return gGame.secsPassed;
}

// document.oncontextmenu = function (e) {
//     var evt = new Object({ keyCode: 93 });
//     stopEvent(e);
// }
// function stopEvent(event) {
//     if (event.preventDefault != undefined)
//         event.preventDefault();
//     if (event.stopPropagation != undefined)
//         event.stopPropagation();
// }
// var gCell ={
//     minesAroundCount: 0,
//     isShown: true,
//     isMine: false,
//     isMarked: true
// }



