const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require("./models/Game");
const {
  calcVector,
  getDistanceOfVector,
  random,
  minScreenSize,
} = require("./utils");

const PORT = process.env.PORT || 8080;
const PUBLIC_FOLDER = "public";
const VIEWS_FOLDER = "views";

let game = new Game();

app.use(express.static(path.join(__dirname, PUBLIC_FOLDER)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, VIEWS_FOLDER, "index.html"));
});

io.on("connection", (socket) => {
  //create a new player and add it to our players array
  let currentPlayer;
  // Avant de commencer le client envoie des meta donnéess
  socket.on("init", (data) => {
    currentPlayer = game.addPlayer(
      socket.id,
      data.window,
      data.name.slice(0, 15),
      data.color
    );
    socket.emit("newPlayer", currentPlayer);
  });
  //On envoye au client ses données

  //send the players object to the new player
  io.emit("update", { players: game.players });

  socket.on("moving", (playerMouvementInformation) => {
    if (currentPlayer !== undefined)
      currentPlayer.mouse = playerMouvementInformation;
  });

  socket.on("shoot", (shootCord) => {
    game.addBullet(
      currentPlayer.x,
      currentPlayer.y,
      shootCord.x,
      shootCord.y,
      currentPlayer
    );
  });

  socket.on("disconnect", () => {
    game.players = game.players.filter((p) => p.id !== socket.id);
    console.log(
      `Player disconnected: ${socket.id}, current players: ${game.players.length}`
    );
  });
});

//gamestate loop
setInterval(() => {
  game.filterBullet();
  if (game.players.length === 0) return;
  game.bullets.forEach((bullet) => {
    let vector = calcVector(
      bullet.current.x,
      bullet.current.y,
      bullet.end.x,
      bullet.end.y
    );
    let distance = getDistanceOfVector(vector);

    let coef = distance / bullet.speed;
    if (coef > 1) {
      bullet.current.x += vector.x / coef;
      bullet.current.y += vector.y / coef;
    } else {
      bullet.current.x += bullet.end.x;
      bullet.current.y += bullet.end.y;
      bullet.isAlive = false;
    }
  });

  game.players.forEach((player) => {
    let bulletCollided = player.isCollidingWith(game.bullets);
    if (bulletCollided !== null) {
      let playerId = bulletCollided.player.id;

      game.players.find((p) => p.id !== playerId).score++;

      //TODO A enlever avec la map dynamique
      let min = minScreenSize(game.players);
      player.x = random(0, min.width);
      player.y = random(0, min.height);
    }

    let vector = calcVector(player.x, player.y, player.mouse.x, player.mouse.y);
    let distance = getDistanceOfVector(vector);

    let coef = distance / player.speed;
    if (coef > 1) {
      player.x += vector.x / coef;
      player.y += vector.y / coef;
    } else {
      player.x = player.mouse.x;
      player.y = player.mouse.y;
    }
  });
  io.emit("update", { players: game.players, bullets: game.bullets });
}, 30 / 1000);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
