import {gameSettings} from "./gameSettings.js";

//elements
let boardCanvas
let gameEndModal
let gameResult
let playerStatus
let swapStartMessage
let swap2Message
let swapChooseButtons
let placeSwap2
let player1Timer
let player2Timer
let notationTab
let player1NameDisplay
let player2NameDisplay

let ctx

export function initDOM() {
    boardCanvas = document.getElementById('board');
    gameEndModal = document.getElementById('gameEndModal');
    document.getElementById("playAgainButton").addEventListener("click", startGame);
    document.getElementById("player1ChooseBlack").addEventListener("click", () => swapChoose('black'));
    document.getElementById("player1ChooseWhite").addEventListener("click", () => swapChoose('white'));
    
    document.getElementById("player2ChooseBlack").addEventListener("click", () => swapChoose('black'));
    document.getElementById("player2ChooseWhite").addEventListener("click", () => swapChoose('white'));
    
    gameResult = document.getElementById('gameResult');
    playerStatus = {
        1: document.getElementById('player1Status'),
        2: document.getElementById('player2Status')
    }
    swapStartMessage = {
    1: document.getElementById('player1SwapStartMessage'),
    2: document.getElementById('player2SwapStartMessage')
    };
    swap2Message = {
    1: document.getElementById('player1Swap2Message'),
    2: document.getElementById('player2Swap2Message')
    };
    swapChooseButtons = {
    1: document.getElementById('player1SwapChoose'),
    2: document.getElementById('player2SwapChoose')
    };
    placeSwap2 = {
    1: document.getElementById('player1PlaceSwap2'),
    2: document.getElementById('player2PlaceSwap2')
    };
    placeSwap2[1].addEventListener("click", () => swapChoose('swap2'));
    placeSwap2[2].addEventListener("click", () => swapChoose('swap2'));
    
    player1Timer = document.getElementById('player1Timer');
    player2Timer = document.getElementById('player2Timer');
    notationTab = document.getElementById('notationTab');
    player1NameDisplay = document.getElementById('player1NameDisplay');
    player2NameDisplay = document.getElementById('player2NameDisplay');

    ctx = boardCanvas.getContext('2d');
    boardCanvas.width = boardSizePx * dpr;
    boardCanvas.height = boardSizePx * dpr;
    boardCanvas.style.width = boardSizePx + "px";
    boardCanvas.style.height = boardSizePx + "px";
    ctx.scale(dpr, dpr);
}


const gridSizeLines = 15;
const boardSizePx = 725;
const gridPaddingPx = 50;
const cordsPaddingPx = 35;
const gridSizePx = boardSizePx - 2 * gridPaddingPx;
const dpr = window.devicePixelRatio || 1;

const spacing = gridSizePx/(gridSizeLines - 1);
const gridLineWidth = 1;
const gridOuterLineWidth = 2;
const stoneBorderWidth = 1.5;
const coordinatesFontSize = 16;

function drawBoard() {
    ctx.clearRect(0, 0, boardSizePx, boardSizePx);
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
        ctx.arc(row * spacing + gridPaddingPx, col * spacing + gridPaddingPx, 4, 0, Math.PI * 2);
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
    ctx.arc(x,y, spacing * 0.45 , 0, Math.PI * 2);
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
    
    ctx.beginPath();
    ctx.arc(moveHistory[moveHistory.length - 1].c * spacing + gridPaddingPx, moveHistory[moveHistory.length - 1].r * spacing + gridPaddingPx, spacing * 0.075, 0, Math.PI * 2);
    ctx.strokeStyle = "red";''
    ctx.lineWidth = 2;
    ctx.stroke();
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
let time;
let increment;
let time1;
let time2;
let timerInterval = null;
let timeStart;
let time1update;
let time2update;
let moveHistory;
let notation;

export function startGame() {
    console.log(gameSettings);
    if (gameSettings.player1Name) {
        player1NameDisplay.textContent = gameSettings.player1Name;
    } else {
        player1NameDisplay.textContent = "Player 1"
    }
    if (gameSettings.player2Name) {
        player2NameDisplay.textContent = gameSettings.player2Name;
    } else {
        player2NameDisplay.textContent = "Player 2"
    }

    if (gameSettings.timer) {
        time = 600 * gameSettings.timer;
    } else {
        time = 600 * 20
    }
    if (gameSettings.increment) {
        increment = 10 * gameSettings.increment;
    } else {
        increment = 10 * 5;
    }


    gameEndModal.close();
    time1 = time;
    time2 = time;
    time1update = time;
    time2update = time;
    moveHistory = [];
    move = 0;
    stone = 1;
    turn = gameSettings.startingPlayer;
    swap2 = false;
    timeStart = Math.round(Date.now() / 100);
    notation = "";
    notationTab.textContent = notation;
    
    const initialFormat1 = formatTime(time1);
    const initialFormat2 = formatTime(time2);


    player1Timer.textContent = initialFormat1.replace(/[0-9]/g, '8');
    player2Timer.textContent = initialFormat2.replace(/[0-9]/g, '8');
    player1Timer.style.width = "auto";
    player2Timer.style.width = "auto";
    player1Timer.style.width = player1Timer.offsetWidth + "px";
    player2Timer.style.width = player2Timer.offsetWidth + "px";
    player1Timer.textContent = initialFormat1;
    player2Timer.textContent = initialFormat2;

    timerInterval = setInterval(tick, 100);
    
    playerStatus[turn].classList.add("highlight");
    playerStatus[3 - turn].classList.remove("highlight");
    swapStartMessage[turn].classList.remove("hidden");
    swapStartMessage[3 - turn].classList.add("hidden");

    winner = null;
    board = [];
    for (let row = 0; row < gridSizeLines; row = row + 1) {
        board[row] = [];
        for (let col = 0; col < gridSizeLines; col = col + 1) {
            board[row][col] = null;
        }
    }
    enableBoardInteraction();
    drawBoard();
}

function enableBoardInteraction() {
    boardCanvas.addEventListener("click", boardClick);
}

function disableBoardInteraction() {
    boardCanvas.removeEventListener("click", boardClick);
}

function swapChoose(choice) {
    enableBoardInteraction();
    if (choice === 'black') {
        incrementTime();
        turn = 3 - turn;
    } else if (choice === 'swap2') {
        swap2 = true;
        swap2Message[turn].classList.remove("hidden");
    }
    updateUI()
    swapChooseButtons[turn].classList.add("hidden");
    swapChooseButtons[3 - turn].classList.add("hidden");
}

function updateUI() {
    playerStatus[turn].classList.add("highlight");
    playerStatus[3 - turn].classList.remove("highlight");

    if (move === 3) {
        swapStartMessage[3 - turn].classList.add("hidden");
        swapChooseButtons[turn].classList.remove("hidden");
        placeSwap2[turn].classList.remove("hidden");
    } else if (move === 5 && swap2 === true) {
        swap2Message[3 - turn].classList.add("hidden");
        swapChooseButtons[turn].classList.remove("hidden");
        placeSwap2[turn].classList.add("hidden");
    }
}
function changeTurn() {
    turn = 3 - turn;
}

function updateTurn (event, choice) {
    stone = 3 - stone;
    time1update = time1;
    time2update = time2;
    timeStart = Math.round(Date.now() / 100);

    if (event === "stonePlaced") {
        move = move + 1;
        if (move >= 3 && swap2 === false || move >= 5) {
            incrementTime(); 
            changeTurn();
        }
    }
}

// timer
function tick() {
    if (turn === 1) {
        time1 = time1update - (Math.round(Date.now() / 100) - timeStart);
        
        if (time1 <= 0) {
            time1 = 0;
            updateTimer();
            winner = 2;
            endGame();
        }

    }
    if (turn === 2) {
        time2 = time2update - (Math.round(Date.now() / 100) - timeStart);
        if (time2 <= 0) {
            time2 = 0;
            updateTimer();
            winner = 1;
            endGame()
        }
    }
    updateTimer();
}

function updateTimer() {
    player1Timer.textContent = formatTime(time1);
    player2Timer.textContent = formatTime(time2);   
}

function formatTime(deciseconds) {
    const ds = deciseconds % 10;
    const s = Math.floor(deciseconds / 10) % 60;
    const m = Math.floor(deciseconds / 600) % 60;
    const h = Math.floor(deciseconds / 36000);
    //return `${h > 0 ? h + ':' : ''}${m < 10 && m > 0 ? '0' : ''}${m > 0 ? m + ':' : ''}${s < 10 ? '0' : ''}${s}.${ds}`;
    return `${h > 0 ? h + ':' : ''}${h > 0 && m < 10 ? '0' : ''}${m + ':'}${s < 10 ? '0' : ''}${s}.${ds}`;
}

function incrementTime() {
    if (turn === 1) {
        time1 = time1 + increment;
    }
    if (turn === 2) {
        time2 = time2 + increment;
    }
}

function boardClick(click) {
    const rect = boardCanvas.getBoundingClientRect();
    const col = Math.round((click.clientX - rect.left - gridPaddingPx) / spacing);
    const row = Math.round((click.clientY - rect.top - gridPaddingPx) / spacing);
    if (col > -1 && col < gridSizeLines && row > -1 && row < gridSizeLines && board[row][col] === null) {
        board[row][col] = stone;
        moveHistory.push({r: row, c: col, st: stone});
        drawStones();
        winDetection(row, col, stone);
        updateTurn("stonePlaced");
        updateUI();
        updateNotation()

        if (move === 3 || move === 5 && swap2 === true) {
            disableBoardInteraction();
        }
    }
    if (move >= gridSizeLines * gridSizeLines) {
        endGame();
    }
    console.log("move " + move, "stone " + stone, "turn " + turn);
}

function updateNotation() {
    notation = "";
    if (move > 0) {
        for (let moves = 0; moves < move; moves = moves + 1) {
            notation += String.fromCharCode(moveHistory[moves].c + 65) + (15 - moveHistory[moves].r) + ", ";
        }
    }
    notationTab.textContent = notation;
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
    clearInterval(timerInterval);
    disableBoardInteraction()
    startingPlayer = 3 - startingPlayer;
    if (winner) {
        gameResult.textContent = "Player " + winner + " Won!";
    } else {
        gameResult.textContent = "Draw!";

    }
    gameEndModal.showModal();

}