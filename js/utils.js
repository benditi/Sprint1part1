'use strict';

//render mat
function renderMat(mat) {
    var strHTML = '';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cellClass = '';
            cellClass = 'blank'
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td class="${cellClass}" id="${tdId}" onclick="cellClicked(${i},${j})"
            oncontextmenu="cellMarked(${i},${j})"></td>`
        }
        strHTML += '</tr>';
    }
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}

// get empty cell
function getEmptyCell() {
    var emptyCells = getEmptyCells();
    var idx = getRandomIntInclusive(0, emptyCells.length - 1);
    var emptyCell = emptyCells[idx];
    return emptyCell;
}

// get empty cells
function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown ===false){
                emptyCells.push({ i:i, j:j });
            }
        }
    }
    return emptyCells;
}

// random number NOT inclusive max
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Neighbors loop
function getNegs(cellI, cellJ, board) {
    var negs = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === cellI && j === cellJ) continue
            negs.push({i:i, j:j});
        }
    }
    return negs;
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function createMat(rowsIdx, colsIdx){
    var newMat = []
    for (var i = 0; i < rowsIdx; i++) {
        newMat[i] = [];
        for (var j = 0; j < colsIdx; j++) {
            newMat[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return newMat;
}

