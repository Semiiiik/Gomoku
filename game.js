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

boardCanvas.width = boardSizePx * dpr;
boardCanvas.height = boardSizePx * dpr;

boardCanvas.style.width = boardSizePx + "px";
boardCanvas.style.height = boardSizePx + "px";
ctx.scale(dpr, dpr);

let clickX;
let clickY;

function drawBoard() {
    ctx.lineWidth = 1.5;
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

    ctx.lineWidth = 2;
    ctx.strokeRect(gridPaddingPx, gridPaddingPx, gridSizePx, gridSizePx);

    //star points
    const starPoints = [
        [3, 3], [3, 11],
        [7, 7],
        [11, 3], [11, 11]
    ]

    for (const [row, col] of starPoints) {
        ctx.beginPath();
        ctx.arc(row * spacing + gridPaddingPx, col * spacing + gridPaddingPx, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    //coordinates
    ctx.font = "16px 'Lexend', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const cordsLetters = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"
    ]

    for (let letters = 0; letters < cordsLetters.length; letters++) {
        const letter = cordsLetters[letters];
        ctx.fillText(letter, letters * spacing + gridPaddingPx, cordsPaddingPx + gridSizePx + gridPaddingPx);
    }

    const cordsNumbers = [
        "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1",
    ]

    for (let numbers = 0; numbers < cordsNumbers.length; numbers++) {
        const number = cordsNumbers[numbers];
        ctx.fillText(number, gridPaddingPx - cordsPaddingPx, numbers * spacing + gridPaddingPx);
    }

    console.log("drawBoard");
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
    ctx.arc(x,y, spacing * 0.438 , 0, Math.PI * 2,);
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    ctx.fill()
    ctx.stroke()
    console.log("drawStone");
}

function drawStones() {
    ctx.clearRect(0, 0, boardSizePx, boardSizePx);
    drawBoard()
    for (let row = 0; row < gridSizeLines; row++) {
        for (let col = 0; col < gridSizeLines; col++) {
            if (board[row][col] !== null) {
                drawStone(col * spacing + gridPaddingPx, row * spacing + gridPaddingPx, board[row][col]);
            }
        }
    }
    console.log("drawStones");
}

//game logic
let board = [];
let turn = 1;

function startGame() {
    for (let row = 0; row < gridSizeLines; row++) {
        board[row] = [];
        for (let col = 0; col < gridSizeLines; col++) {
            board[row][col] = null;
        }
    }
    console.table(board);
    enableBoardInteraction();
    drawBoard();
    console.log("startGame");
}

function enableBoardInteraction() {
    boardCanvas.addEventListener("click", boardClick);
    console.table(board);
}

function disableBoardInteraction() {
    boardCanvas.removeEventListener("click", boardClick);
}

function boardClick(click) {
    let col;
    let row;

    const rect = boardCanvas.getBoundingClientRect();

    clickX = click.clientX - rect.left;
    clickY = click.clientY - rect.top;

    col = Math.round((clickX - gridPaddingPx) / spacing)
    row = Math.round((clickY - gridPaddingPx) / spacing)

    if (col > -1 && col < gridSizeLines && row > -1 && row < gridSizeLines && board[row][col] === null) {
        board[row][col] = turn;
        turn = 3 - turn;
        drawStones();
    }

    console.table(board);
}

startGame();