//elements
const boardCanvas = document.getElementById('board');
const gameEndModal = document.getElementById('gameEndModal');
document.getElementById("playAgainButton").addEventListener("click", startGame);
document.getElementById("player1ChooseBlack").addEventListener("click", swapChooseBlack);
document.getElementById("player1ChooseBlack").addEventListener("click", enableBoardInteraction);
document.getElementById("player1ChooseWhite").addEventListener("click", swapChooseWhite);
document.getElementById("player1ChooseWhite").addEventListener("click", enableBoardInteraction);
document.getElementById("player1PlaceSwap2").addEventListener("click", swapChoose2);
document.getElementById("player1PlaceSwap2").addEventListener("click", enableBoardInteraction);
document.getElementById("player2ChooseBlack").addEventListener("click", swapChooseBlack);
document.getElementById("player2ChooseBlack").addEventListener("click", enableBoardInteraction);
document.getElementById("player2ChooseWhite").addEventListener("click", swapChooseWhite);
document.getElementById("player2ChooseWhite").addEventListener("click", enableBoardInteraction);
document.getElementById("player2PlaceSwap2").addEventListener("click", swapChoose2);
document.getElementById("player2PlaceSwap2").addEventListener("click", enableBoardInteraction);
const gameResult = document.getElementById('gameResult');
const player1Status = document.getElementById('player1Status');
const player2Status = document.getElementById('player2Status');
const player1SwapStartMessage = document.getElementById('player1SwapStartMessage');
const player2SwapStartMessage = document.getElementById('player2SwapStartMessage');
const player1Swap2Message = document.getElementById('player1Swap2Message');
const player2Swap2Message = document.getElementById('player2Swap2Message');
const player1SwapChoose  = document.getElementById('player1SwapChoose');
const player2SwapChoose = document.getElementById('player2SwapChoose');
const player1PlaceSwap2 = document.getElementById('player1PlaceSwap2');
const player2PlaceSwap2 = document.getElementById('player2PlaceSwap2');
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
    for (let lines = 0; lines < gridSizeLines; lines = lines + 1) {
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
    for (let letters = 0; letters < cordsLetters.length; letters = letters + 1) {
        const letter = cordsLetters[letters];
        ctx.fillText(letter, letters * spacing + gridPaddingPx, cordsPaddingPx + gridSizePx + gridPaddingPx);
    }
    const cordsNumbers = [
        "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1",
    ];
    for (let numbers = 0; numbers < cordsNumbers.length; numbers = numbers + 1) {
        const number = cordsNumbers[numbers];
        ctx.fillText(number, gridPaddingPx - cordsPaddingPx, numbers * spacing + gridPaddingPx);
    }
}

function drawStone(x, y, stone) {
    let color;
    if (stone === 1) {
        color = "black";
    } else if (stone === 2) {
        color = "white";
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
    for (let row = 0; row < gridSizeLines; row = row + 1) {
        for (let col = 0; col < gridSizeLines; col = col + 1) {
            if (board[row][col] !== null) {
                drawStone(col * spacing + gridPaddingPx, row * spacing + gridPaddingPx, board[row][col]);
            }
        }
    }
}

//game logic
const winCondition = 5;
let board = [];
let stone = 1;
let move = 0;
let winner = null;
let turn;
let swap2 = false;
let startingPlayer = 1;

function startGame() {
    gameEndModal.close();
    move = 0;
    stone = 1;
    turn = startingPlayer;
    swap2 = false;
    if (turn === 1) {
        player2Status.classList.remove("highlight");
        player1Status.classList.add("highlight");
        player2SwapStartMessage.classList.add("hidden");
        player1SwapStartMessage.classList.remove("hidden");
    } else if (turn === 2) {
        player1Status.classList.remove("highlight");
        player2Status.classList.add("highlight");
        player1SwapStartMessage.classList.add("hidden");
        player2SwapStartMessage.classList.remove("hidden");
    }
    winner = null;
    board = [];
    for (let row = 0; row < gridSizeLines; row = row + 1) {
        board[row] = [];
        for (let col = 0; col < gridSizeLines; col = col + 1) {
            board[row][col] = null;
        }
    }
    console.table(board);
    enableBoardInteraction();
    drawBoard();
    drawStones()
}

function enableBoardInteraction() {
    boardCanvas.addEventListener("click", boardClick);
}

function disableBoardInteraction() {
    boardCanvas.removeEventListener("click", boardClick);
}

function swapChooseBlack() {
    player1SwapChoose.classList.add("hidden");
    player2SwapChoose.classList.add("hidden");

    turn = 3 - turn;
    if (turn === 1) {
        player2Status.classList.remove("highlight");
        player1Status.classList.add("highlight");
    } else if (turn === 2) {
        player1Status.classList.remove("highlight");
        player2Status.classList.add("highlight");
    }
}

function swapChooseWhite() {
    player1SwapChoose.classList.add("hidden");
    player2SwapChoose.classList.add("hidden");
}

function swapChoose2() {
    player1SwapChoose.classList.add("hidden");
    player2SwapChoose.classList.add("hidden");

    swap2 = true;
    if (turn === 1) {
        player1Swap2Message.classList.remove("hidden");
    } else if (turn === 2) {
        player2Swap2Message.classList.remove("hidden");
    }
}

function updateUI () {
    if (turn === 1) {
        player2Status.classList.remove("highlight");
        player1Status.classList.add("highlight");
    } else if (turn === 2) {
        player1Status.classList.remove("highlight");
        player2Status.classList.add("highlight");
    }

    if (move === 3 && turn === 1) {
        player2SwapStartMessage.classList.add("hidden");
        player1SwapChoose.classList.remove("hidden");
        player1PlaceSwap2.classList.remove("hidden");
    } else if (move === 3 && turn === 2) {
        player1SwapStartMessage.classList.add("hidden");
        player2SwapChoose.classList.remove("hidden");
        player2PlaceSwap2.classList.remove("hidden");
    } else if (move === 5 && swap2 === true && turn === 1) {
        player1SwapChoose.classList.remove("hidden");
        player1PlaceSwap2.classList.add("hidden");
        player2Swap2Message.classList.add("hidden");
    } else if (move === 5 && swap2 === true && turn === 2) {
        player2SwapChoose.classList.remove("hidden");
        player2PlaceSwap2.classList.add("hidden");
        player1Swap2Message.classList.add("hidden");
    }
}
function updateTurn () {
    move = move + 1;
    stone = 3 - stone;
    if (move >= 3 && swap2 === false || move >= 5) {
        turn = 3 - turn;
    }
}
function boardClick(click) {
    const rect = boardCanvas.getBoundingClientRect();
    const col = Math.round((click.clientX - rect.left - gridPaddingPx) / spacing);
    const row = Math.round((click.clientY - rect.top - gridPaddingPx) / spacing);
    if (col > -1 && col < gridSizeLines && row > -1 && row < gridSizeLines && board[row][col] === null) {
        board[row][col] = stone;
        drawStones();
        winDetection(row, col, stone);
        updateTurn();
        updateUI();
        if (move === 3 || move === 5 && swap2 === true) {
            disableBoardInteraction();
        }
    }
    if (move >= gridSizeLines * gridSizeLines) {
        endGame();
    }
    console.log("move" + move, "stone" + stone, "turn" + turn);
    console.table(board);
}

function winDetection(row, col, stone) {
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
                board[row + dirRow * steps][col + dirCol * steps] === stone
            ) {
                stonesInARow = stonesInARow + 1;
                steps = steps + 1;
            }
        }
        if (stonesInARow === winCondition) {
            winner = stone;
            endGame();
        }
    }
}

function endGame() {
    disableBoardInteraction()
    startingPlayer = 3 - startingPlayer;
    if (winner) {
        console.log("player" + winner + "won");
        gameResult.textContent = "Player " + winner + " Won!";
    } else {
        console.log("draw!");
        gameResult.textContent = "Draw!";

    }
    gameEndModal.showModal();

}

startGame();