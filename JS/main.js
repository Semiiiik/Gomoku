import {startGame} from './game.js';
import {initDOM} from './game.js';

const pages = {
  '':
    `
    <button id="startGameButton" onclick="window.location.hash = '#game'">start game</button>
    `,
  '#gameSettings':
    `
    
    `,
  '#game':
    `
    <div class="game">
        <div class="playerStatus" id="player2Status">
            <p>Player 2</p>
            <div class="timer">
                <p class="timerIcon">⏲</p>
                <div class="timerTime" id="player2Timer"></div>
            </div>
            <p class="swapStartMessage" id="player2SwapStartMessage">Place three stones...</p>
            <p class="swap2Message hidden" id="player2Swap2Message">Place two more stones...</p>
            <div class="swapChoose hidden" id="player2SwapChoose">
                <button class="chooseButton" id="player2ChooseBlack">Play as black</button>
                <button class="chooseButton" id="player2ChooseWhite">Play as White</button>
                <button class="chooseButton" id="player2PlaceSwap2">Place swap 2</button>
            </div>
        </div>
        <canvas id="board" width="725px" height="725px" ></canvas>
        <div class="playerStatus" id="player1Status">
            <p>Player 1</p>
            <div class="timer">
                <p class="timerIcon">⏲</p>
                <div class="timerTime" id="player1Timer"></div>
            </div>
            <p class="swapStartMessage" id="player1SwapStartMessage">Place three stones...</p>
            <p class="swap2Message hidden" id="player1Swap2Message">Place two more stones...</p>
            <div class="swapChoose hidden" id="player1SwapChoose">
                <button class="chooseButton" id="player1ChooseBlack">Play as black</button>
                <button class="chooseButton" id="player1ChooseWhite">Play as white</button>
                <button class="chooseButton" id="player1PlaceSwap2">Place swap 2</button>
            </div>
        </div>
    </div>
    <div id="notationWrapper">
        <div id="notationTab"></div>
    </div>

        <dialog class="modal" id="gameEndModal">
            <h1> Game Ended </h1>
            <h2 id="gameResult"> Player X Won</h2>
            <button id="playAgainButton">Play Again</button>
            <button>Analysis</button>
            <button>Save Game</button>
        </dialog>  
    `
};

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

function route() {
    const hash = window.location.hash;
    const content = document.getElementById("content");
    
    content.innerHTML = pages[hash];
    if (hash === "#game") {
        initDOM();
        startGame();
    };
}

