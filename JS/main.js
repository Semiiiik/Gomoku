import {startGame} from './game.js';
import {initDOM} from './game.js';
import {saveGameSettings} from './gameSettings.js';
import {gameSettings} from "./gameSettings.js";


const pages = {
  '':
    `
    <button id="quickStartButton" onclick="window.location.hash = '#game'">Quick start</button>
    <button id="createGameButton" onclick="window.location.hash = '#gameSettings'">Create Game</button>
    `,
  '#gameSettings':
    `
    <div class="gameSettings"> 
        <h1>Game Settings</h1>
        
        <div id="playerNameSettings">
            <input type="text" maxlength="25" class="playerNameInput" id="player1NameInput" placeholder="Player 1">
            <input type="text" maxlength="25" class="playerNameInput" id="player2NameInput" placeholder="Player 2">
        </div>
        
        <div id="startingPlayerSettings">
            <p>Starting Player:</p>
            <input type="radio" name="startingPlayer" id="startingPlayer1" value="1" checked>
            <label for="startingPlayer1">Player 1</label>
            <input type="radio" name="startingPlayer" id="startingPlayer2" value="2">
            <label for="startingPlayer2">Player 2</label>
        </div>
        
        <div id="timerSettings">
            <p>Time per game (min):</p>
            <input type="number" class="timerInput" id="timerInput" min="1" max="180" value="20">
            <p>Increment per move (s):</p>
            <input type="number" class="incrementInput" id="incrementInput" min="0" max="180" value="5">
        </div>
        
        <button id="startGameButton" onclick="window.location.hash = '#game'">start game</button>
        
        
    
    </div>  
        
 
    `,
  '#game':
    `
    <div class="game">
        <div class="playerStatus" id="player2Status">
            <p id="player2NameDisplay">Player 2</p>
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
            <p id="player1NameDisplay">Player 1</p>
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
            <button id="backButton" onclick="window.location.hash = ''">Back</button>
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
    }
}

document.body.addEventListener("click", (event) => {
    if (event.target.id === "startGameButton") {
        saveGameSettings();
    }
})