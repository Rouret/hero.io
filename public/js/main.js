const socket = io();
const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const FPS = 30;
const timePerTick = 1000 / FPS;

//GAME SETUP
const BACKGROUND_COLOR = "#999999";
let currentPlayer = {};
//from the server
let gameState = {
  needToDraw: false,
  players: [],
};
//local mouse position
let mouse = {
  current: {
    x: 0,
    y: 0,
  },
  previous: {
    x: 0,
    y: 0,
  },
};

//SETUP
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

//Detect mouse movement
canvas.addEventListener(
  "mousemove",
  function (event) {
    mouse.current.x = event.clientX;
    mouse.current.y = event.clientY;

    if (
      mouse.current.x != mouse.previous.x ||
      mouse.current.y != mouse.previous.y
    ) {
      socket.emit("moving", mouse.current);
      mouse.previous = { ...mouse.current };
    }
  },
  false
);

//detect click
canvas.addEventListener(
  "click",
  function (event) {
    socket.emit("shoot", { x: event.clientX, y: event.clientY });
  },
  false
);

//IO
socket.emit("init", {
  window: {
    width: canvas.width,
    height: canvas.height,
  },
});

socket.on("newPlayer", (player) => {
  currentPlayer = { ...player };
});

socket.on("update", (gameStateFromServer) => {
  gameState = { ...gameStateFromServer };
  gameState.needToDraw = true;
});

//Canvas
function drawPlayer(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.size / 2,
    player.y - player.size / 2,
    player.size,
    player.size
  );

  if (player.id === currentPlayer.id) {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.fillText(
      "You",
      player.x - currentPlayer.size / 1.9,
      player.y + currentPlayer.size
    );
  }
}

function drawBullet(bullet) {
  ctx.fillStyle = bullet.color;
  ctx.fillRect(bullet.current.x - 2, bullet.current.y - 2, 10, 10);
}

function drawLeaderboard() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Leaderboard", 10, 50);
  ctx.font = "20px Arial";
  gameState.players.forEach((player, index) => {
    ctx.fillText(
      `${index + 1}. ${player.id}: ${player.score}`,
      10,
      80 + index * 30
    );
  });
}

function draw() {
  if (gameState.needToDraw) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw background
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw players
    gameState.players.forEach(drawPlayer);

    //draw bullets
    gameState.bullets.forEach(drawBullet);

    drawLeaderboard();

    gameState.needToDraw = false;
  }
}

if (canvas.getContext) {
  console.log("Game is ready 😊");
  setInterval(draw, timePerTick);
}
