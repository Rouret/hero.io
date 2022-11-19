const socket = io();
const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const FPS = 30;
const timePerTick = 1000 / FPS;

//GAME SETUP
const BACKGROUND_COLOR = "#999999"

//SETUP
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw background
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

if (canvas.getContext) {
    console.log("Game is ready 😊")
    setInterval(draw, timePerTick);
}