import io from "socket.io-client";
import Bullet from "../models/Bullet";
import Boost from "../models/Boost";
import Player from "../models/Player";
import Dimension from '../models/Dimension';
const socket = io();

const canvas: HTMLCanvasElement = document.getElementById("app") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const FPS = 60;
const timePerTick = 1000 / FPS;

type GameState = {
  needToDraw: boolean;
  players: Player[];
  bullets: Bullet[];
  boosts: Boost[];
};

//GAME SETUP
const BACKGROUND_COLOR = "#fff";
const cheat = false;
let frameIndex = 0;
let username;

const elName: HTMLInputElement = document.getElementById(
  "name"
) as HTMLInputElement;
const elLanding: HTMLDivElement = document.getElementById(
  "landing"
) as HTMLDivElement;
const playerRunImage = document.getElementById(
  "player_run"
) as HTMLImageElement;
const bulletImage = document.getElementById("bullet") as HTMLImageElement;

const gunImage = document.getElementById("gun") as HTMLImageElement;

//from the server
let gameState: GameState = {
  needToDraw: false,
  players: [],
  bullets: [],
  boosts: [],
};
//local mouse position
const mouse = {
  current: {
    x: 0,
    y: 0,
  },
  previous: {
    x: 0,
    y: 0,
  },
};
//config player
const playerRunImageWidth = 280;
const playerRunImageHeight = 40;
const playerRunImageFrame = 7;
const playerRunImageFrameWidth = playerRunImageWidth / playerRunImageFrame;
const playerRunImageFrameHeight = playerRunImageHeight;
const playerRunImageFrameY = 0;

const elButton: HTMLButtonElement = document.getElementById(
  "start"
) as HTMLButtonElement;
elButton.addEventListener("click", goLesFumer);
elName.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    goLesFumer();
  }
});

function goLesFumer() {
  username = elName.value;
  if (username.length === 0) {
    username = "Unknown";
  }
  elLanding.style.display = "none";
  canvas.style.display = "block";

  init();
}
//Canvas
function drawPlayer(player: Player) {
  const coefAceSpped = Math.floor(player.speed / player.initSpeed);
  const ajustedFPS = Math.floor(FPS / coefAceSpped);
  const ajustedFrameIndex = frameIndex % ajustedFPS;

  const playerRunImageFrameIndex = Math.floor(
    (ajustedFrameIndex * (playerRunImageFrame - 1)) / ajustedFPS
  );

  const playerRunImageFrameX =
    playerRunImageFrameIndex * playerRunImageFrameWidth;

  ctx.save();
  ctx.translate(player.coordinate.x, player.coordinate.y);
  if (Math.abs(player.rotation) > Math.PI / 2) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    playerRunImage,
    playerRunImageFrameX,
    playerRunImageFrameY,
    playerRunImageFrameWidth,
    playerRunImageFrameHeight,
    -player.size / 2,
    -player.size / 2,
    player.size,
    player.size
  );
  ctx.restore();

  //draw gun
  ctx.save();
  ctx.translate(player.coordinate.x, player.coordinate.y);
  ctx.rotate(player.rotation);
  ctx.drawImage(gunImage, -player.size / 2, -player.size / 2, 40, 20);

  ctx.restore();

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(
    player.name,
    player.coordinate.x - player.name.length * 5,
    player.coordinate.y - player.size / 2 - 10
  );
}

function drawBullet(bullet: Bullet) {
  ctx.save();
  ctx.translate(bullet.current.x - 2, bullet.current.y - 2);
  ctx.drawImage(bulletImage, 0, 0, bullet.size, bullet.size);
  ctx.restore();

  //draw a line from the player to the bullet
  if (cheat) {
    ctx.beginPath();
    ctx.moveTo(bullet.current.x, bullet.current.y);
    ctx.lineTo(bullet.end.x, bullet.end.y);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
}

function drawBoost(boost: Boost) {
  ctx.fillStyle = boost.color;
  const saveFillStyle = ctx.fillStyle;
  ctx.beginPath();
  ctx.fillStyle = boost.color;
  ctx.arc(boost.x, boost.y, boost.size, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = saveFillStyle;
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
  if (frameIndex === FPS) {
    frameIndex = 0;
  } else {
    frameIndex++;
  }
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
  document.addEventListener("keyup", (event) => {
    if (event.key === " ") {
      socket.emit("shoot", { x: mouse.current.x, y: mouse.current.y });
    }
  });

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
    window: new Dimension(canvas.width, canvas.height),
    name: username,
  });
  socket.on("update", (gameStateFromServer) => {
    gameState = { ...gameStateFromServer };
    gameState.needToDraw = true;
  });

  if (canvas.getContext("2d")) {
    console.log("Game is ready 😊");
    setInterval(draw, timePerTick);
  }
}
