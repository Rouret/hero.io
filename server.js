const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Player = require("./models/Player");
const Bullet = require("./models/Bullet");
const {
  calcVector,
  getDistanceOfVector,
  random,
  minScreenSize,
} = require("./utils");

const PORT = process.env.PORT || 8081;
const PUBLIC_FOLDER = "public";
const VIEWS_FOLDER = "views";

let players = [];
let bullets = [];

app.use(express.static(path.join(__dirname, PUBLIC_FOLDER)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, VIEWS_FOLDER, "index.html"));
});

io.on("connection", (socket) => {
  //create a new player and add it to our players array
  let currentPlayer;
  // Avant de commencer le client envoie des meta donnéess
  socket.on("init", (data) => {
    console.log(data);
    currentPlayer = new Player(
      socket.id,
      data.window,
      data.name.slice(0, 10),
      data.color
    );
    players.push(currentPlayer);
  });
  //On envoye au client ses données
  socket.emit("newPlayer", currentPlayer);

  //send the players object to the new player
  io.emit("update", { players: players });

  socket.on("moving", (playerMouvementInformation) => {
    if (currentPlayer === undefined) return;
    currentPlayer.mouse = playerMouvementInformation;
  });

  socket.on("shoot", (shootCord) => {
    bullets.push(
      new Bullet(
        currentPlayer.x,
        currentPlayer.y,
        shootCord.x,
        shootCord.y,
        currentPlayer
      )
    );
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
    console.log(
      `Player disconnected: ${socket.id}, current players: ${players.length}`
    );
  });
});

//gamestate loop
setInterval(() => {
  bullets = bullets.filter((b) => b.isAlive);
  if (players.length === 0) return;
  bullets.forEach((bullet) => {
    let vector = calcVector(
      bullet.current.x,
      bullet.current.y,
      bullet.end.x,
      bullet.end.y
    );
    let distance = getDistanceOfVector(vector);

    let coef = distance / bullet.speed;
    if (coef > 1) {
      bullet.current.x += vector.x * (1 / coef);
      bullet.current.y += vector.y * (1 / coef);
    } else {
      bullet.current.x += bullet.end.x;
      bullet.current.y += bullet.end.y;
      bullet.isAlive = false;
    }
  });

  players.forEach((player) => {
    let bulletCollided = player.isCollidingWith(bullets);
    if (bulletCollided !== null) {
      let playerId = bulletCollided.player.id;
      let p = players.find((p) => p.id !== playerId);
      p.score += 1;
      let min = minScreenSize(players);
      player.x = random(0, min.width);
      player.y = random(0, min.height);
    }

    let vector = calcVector(player.x, player.y, player.mouse.x, player.mouse.y);
    let distance = getDistanceOfVector(vector);

    let coef = distance / player.speed;
    if (coef > 1) {
      player.x += vector.x * (1 / coef);
      player.y += vector.y * (1 / coef);
    } else {
      player.x = player.mouse.x;
      player.y = player.mouse.y;
    }
  });
  io.emit("update", { players: players, bullets: bullets });
}, 30 / 1000);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
