const boardCanvas = document.getElementById('board');

//drawing
const ctx = boardCanvas.getContext('2d');

const gridSizeLines = 15;
const boardSizePx = 725;
const gridPaddingPx = 50;
const cordsPaddingPx = 35;
const gridSizePx = boardSizePx - 2 * gridPaddingPx;
const dpr = window.devicePixelRatio || 1;
const spacing = gridSizePx/(gridSizeLines - 1);
const gridLineWidth = 1.5;
const gridOuterLineWidth = 2;
const stoneBorderWidth = 1.5;
const stoneRadius = spacing * 0.45;
const starPointRadius = 4;
const coordinatesFontSize = 16;

boardCanvas.width = boardSizePx * dpr;
boardCanvas.height = boardSizePx * dpr;

boardCanvas.style.width = boardSizePx + "px";
boardCanvas.style.height = boardSizePx + "px";
ctx.scale(dpr, dpr);



function drawBoard() {
    ctx.lineWidth = gridLineWidth;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";

    //grid
    ctx.beginPath();
    for (let lines = 0; lines < gridSizeLines; lines++) {
        ctx.moveTo(gridPaddingPx, lines * spacing + gridPaddingPx);
        ctx.lineTo(gridSizePx + gridPaddingPx, lines * spacing + gridPaddingPx);

        ctx.moveTo(lines * spacing + gridPaddingPx, gridPaddingPx);
        ctx.lineTo(lines * spacing + gridPaddingPx, gridSizePx + gridPaddingPx);
    }
    ctx.stroke();

    ctx.lineWidth = gridOuterLineWidth;
    ctx.strokeRect(gridPaddingPx, gridPaddingPx, gridSizePx, gridSizePx);

    //star points
    const starPoints = [
        [3, 3], [3, 11],
        [7, 7],
        [11, 3], [11, 11]
    ];

    for (const [row, col] of starPoints) {
        ctx.beginPath();
        ctx.arc(row * spacing + gridPaddingPx, col * spacing + gridPaddingPx, starPointRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    //coordinates
    ctx.font = coordinatesFontSize + "px 'Lexend', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const cordsLetters = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"
    ];

    for (let letters = 0; letters < cordsLetters.length; letters++) {
        const letter = cordsLetters[letters];
        ctx.fillText(letter, letters * spacing + gridPaddingPx, cordsPaddingPx + gridSizePx + gridPaddingPx);
    }

    const cordsNumbers = [
        "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1",
    ];

    for (let numbers = 0; numbers < cordsNumbers.length; numbers++) {
        const number = cordsNumbers[numbers];
        ctx.fillText(number, gridPaddingPx - cordsPaddingPx, numbers * spacing + gridPaddingPx);
    }
}

function drawStone(x, y, turn) {
    let color;
    if (turn === 1) {
        color = "black";
    } else if (turn === 2) {
        color = "white";
    } else {
        console.log(color, x, y, turn);
    }

    ctx.beginPath();
    ctx.arc(x,y, stoneRadius , 0, Math.PI * 2,);
    ctx.fillStyle = color;
    ctx.lineWidth = stoneBorderWidth;
    ctx.fill();
    ctx.stroke();
}

function drawStones() {
    ctx.clearRect(0, 0, boardSizePx, boardSizePx);
    drawBoard();
    for (let row = 0; row < gridSizeLines; row++) {
        for (let col = 0; col < gridSizeLines; col++) {
            if (board[row][col] !== null) {
                drawStone(col * spacing + gridPaddingPx, row * spacing + gridPaddingPx, board[row][col]);
            }
        }
    }
}

//game logic
const winCondition = 5;

let board = [];
let turn = 1;
let move = 0;
let winner = null;

function startGame() {
    turn = 1;
    for (let row = 0; row < gridSizeLines; row++) {
        board[row] = [];
        for (let col = 0; col < gridSizeLines; col++) {
            board[row][col] = null;
        }
    }
    console.table(board);
    enableBoardInteraction();
    drawBoard();
}

function enableBoardInteraction() {
    boardCanvas.addEventListener("click", boardClick);
    console.table(board);
}

function disableBoardInteraction() {
    boardCanvas.removeEventListener("click", boardClick);
}

function boardClick(click) {
    const rect = boardCanvas.getBoundingClientRect();

    const col = Math.round((click.clientX - rect.left - gridPaddingPx) / spacing);
    const row = Math.round((click.clientY - rect.top - gridPaddingPx) / spacing);

    if (col > -1 && col < gridSizeLines && row > -1 && row < gridSizeLines && board[row][col] === null) {
        move = move + 1;
        board[row][col] = turn;
        drawStones();
        winDetection(row, col, turn);
        turn = 3 - turn;
    }
    if (move >= gridSizeLines * gridSizeLines) {
        endGame();
    }
    console.log("move" + move);
    console.table(board);
}

function winDetection(row, col, turn) {
    let stonesInARow = 1;
    const directions = [
        [[1, 1], [-1, -1]],
        [[-1, 1], [1, -1]],
        [[0, 1], [0, -1]],
        [[-1, 0], [1, 0]]
    ];

    for (const direction of directions) {
        stonesInARow = 1;
        for (const [dirRow, dirCol] of direction) {
            let steps = 1;
            while (
                col + dirCol * steps > -1 &&
                col + dirCol * steps < gridSizeLines &&
                row + dirRow * steps > -1 &&
                row + dirRow * steps < gridSizeLines &&
                board[row + dirRow * steps][col + dirCol * steps] === turn
            ) {
                stonesInARow = stonesInARow + 1;
                steps = steps + 1;
            }
        }
        if (stonesInARow === winCondition) {
            winner = turn;
            endGame();
        }
    }
}



















function endGame() {
    disableBoardInteraction()
    if (winner) {
        console.log("player" + winner + "won");
    } else {
        console.log("draw!");
    }

}

startGame();