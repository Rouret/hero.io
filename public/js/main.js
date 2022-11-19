const socket = io();
const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const FPS = 30;
const timePerTick = 1000 / FPS;

//GAME SETUP
const BACKGROUND_COLOR = "#999999"
var gameState = {
    needToDraw: false,
    players: []
}

//SETUP
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

//IO

socket.on("update", (gameStateFromServer) => {
    gameState = {...gameStateFromServer };
    gameState.needToDraw = true;
})

//Canvas
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, 30, 30);
}

function draw() {
    if (gameState.needToDraw) {
        console.log("Drawing");
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw players
        gameState.players.forEach(drawPlayer)

        gameState.needToDraw = false;
    }
}

if (canvas.getContext) {
    console.log("Game is ready 😊")
    setInterval(draw, timePerTick);
}