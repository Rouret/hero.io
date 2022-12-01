import io from 'socket.io-client';
const socket = io();
const canvas: HTMLCanvasElement = document.getElementById("app") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!!;
const FPS = 60;
const timePerTick = 1000 / FPS;

type Player = {
  name: string;
  score: number;
}

type GameState = {
  needToDraw: boolean;
  players: Player[];
  bullets: [];
  boosts: [];
}

//GAME SETUP
const BACKGROUND_COLOR = "#fff";
let currentPlayer: Player = {
  name: '',
  score: 0
};
let username;
let color = "#" + Math.floor(Math.random() * 16777215).toString(16);

const elColor: HTMLInputElement = document.getElementById('color') as HTMLInputElement;
const elName: HTMLInputElement = document.getElementById("name") as HTMLInputElement;
const elLanding: HTMLDivElement = document.getElementById("landing") as HTMLDivElement;

elColor.value = color;
//from the server
let gameState: GameState = {
  needToDraw: false,
  players: [],
  bullets: [],
  boosts: []
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

const elButton: HTMLButtonElement = document.getElementById('start') as HTMLButtonElement;

elButton.addEventListener('click', goLesFumer);

function goLesFumer() {
  username = elName.value;
  color = elColor.value;

  if (username.length === 0) {
    username = "LE GROS CON";
  }
  elLanding.style.display = "none";
  canvas.style.display = "block";

  init();
}
//Canvas
function drawPlayer(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.size / 2,
    player.y - player.size / 2,
    player.size,
    player.size
  );

  ctx.fillStyle = "#000000";
  ctx.font = "15px Arial";
  ctx.fillText(
    player.name,
    player.x - player.size / 1.9,
    player.y + player.size
  );
}

function drawBullet(bullet) {
  ctx.fillStyle = bullet.color;
  ctx.fillRect(bullet.current.x - 2, bullet.current.y - 2, 10, 10);
}

function drawBoost(boost) {
  ctx.fillStyle = boost.color;
    //ctx.fillRect( boost.x - boost.size / 2, boost.y - boost.size / 2, boost.size, boost.size);
}

function drawLeaderboard() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Leaderboard", 10, 50);
  ctx.font = "20px Arial";
  gameState.players.forEach((player, index) => {
    ctx.fillText(
      `${index + 1}. ${player.name}: ${player.score}`,
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

    //draw boosts
    gameState.boosts.forEach(drawBoost);

    drawLeaderboard();

    gameState.needToDraw = false;
  }
}

function init() {
  //SETUP
  canvas.width = window.document.documentElement.clientWidth;
  canvas.height = window.document.documentElement.clientHeight - 1;
  //Detect mouse movement
  canvas.addEventListener(
    "mousemove",
    function (event) {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      if (
        mouse.current.x !== mouse.previous.x ||
        mouse.current.y !== mouse.previous.y
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
    name: username,
    color: color,
  });

  socket.on("newPlayer", (player) => {
    currentPlayer = { ...player };
  });

  socket.on("update", (gameStateFromServer) => {
    gameState = { ...gameStateFromServer };
    gameState.needToDraw = true;
  });

  if (canvas.getContext('2d')) {
    console.log("Game is ready 😊");
    setInterval(draw, timePerTick);
  }
}
