const socket = io();
const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const FPS = 30;
const timePerTick = 1000 / FPS;

//GAME SETUP
const BACKGROUND_COLOR = "#999999"
const PLAYER_SIZE = 30;
//from the server
var gameState = {
        needToDraw: false,
        players: []
    }
    //local mouse position
var mouse = {
    current: {
        x: 0,
        y: 0
    },
    previous: {
        x: 0,
        y: 0
    }
}

//SETUP
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

//Detect mouse movement
canvas.addEventListener('mousemove', function(event) {
    mouse.current.x = event.clientX;
    mouse.current.y = event.clientY;


    if (mouse.current.x != mouse.previous.x || mouse.current.y != mouse.previous.y) {
        socket.emit("moving", mouse.current);
        mouse.previous = {...mouse.current };
    }
}, false);

//detect click
canvas.addEventListener('click', function(event) {
    socket.emit("shoot", { x: event.clientX, y: event.clientY });
}, false);

//IO
socket.on("update", (gameStateFromServer) => {
    gameState = {...gameStateFromServer };
    gameState.needToDraw = true;
})

//Canvas
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - (PLAYER_SIZE / 2), player.y - (PLAYER_SIZE / 2), PLAYER_SIZE, PLAYER_SIZE);
}

function drawBullet(bullet) {
    ctx.fillStyle = "black";
    ctx.fillRect(bullet.current.x - 2, bullet.current.y - 2, 10, 10);
}

function draw() {
    if (gameState.needToDraw) {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw players
        gameState.players.forEach(drawPlayer)

        //draw bullets
        gameState.bullets.forEach(drawBullet)

        gameState.needToDraw = false;
    }
}

if (canvas.getContext) {
    console.log("Game is ready 😊")
    setInterval(draw, timePerTick);
}