export let gameSettings = {
    player1Name: "",
    player2Name: "",
    startingPlayer: 1,
    timer: 20,
    increment: 5
};

export function saveGameSettings() {
    if (document.getElementById("player1NameInput").value) {
        gameSettings.player1Name = document.getElementById("player1NameInput").value
    } else {
        gameSettings.player1Name = "Player 1"
    }
    if (document.getElementById("player2NameInput").value) {
        gameSettings.player2Name = document.getElementById("player2NameInput").value
    } else {
        gameSettings.player2Name = "Player 2"
    }
    if (document.getElementById("timerInput").value > 0) {
        gameSettings.timer = document.getElementById("timerInput").value;
    } else {
        gameSettings.timer = 20;
    }
    gameSettings.startingPlayer = +document.querySelector('input[name="startingPlayer"]:checked').value;
    if (document.getElementById("incrementInput").value > 0) {
        gameSettings.increment = document.getElementById("incrementInput").value;
    } else {
        gameSettings.increment = 5;
    }
    console.log(gameSettings);
}

