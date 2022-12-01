import express from 'express';
import path from 'path';
import http from 'http';
import { Server, Socket } from 'socket.io';
import Game from "./models/Game";
import {calcVector, getDistanceOfVector, randomPosOnScreen} from './utils';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const PUBLIC_FOLDER = "../dist";
const VIEWS_FOLDER = "../views";
const TICK_RATE = 60;
const BOOST_INTERVAL = TICK_RATE * 10;
let boostTimer = 0;

let game = new Game();

app.use(express.static(path.join(__dirname, PUBLIC_FOLDER)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, VIEWS_FOLDER, "index.html"));
});

io.on("connection", (socket: Socket) => {
  //create a new player and add it to our players array
  let currentPlayer: any;
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

      let randomCoords = randomPosOnScreen(game.players);
      player.x = randomCoords.x;
      player.y = randomCoords.y;
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

    let boostCollided = player.isCollidingWithBoost(game.boosts);
    if (boostCollided !== null) {
      player.setEffect(boostCollided);
      game.boosts = game.boosts.filter((b) => b.id !== boostCollided.id);
    }
  });

  // Generate boosts
  boostTimer++;
  if (boostTimer >= BOOST_INTERVAL) {
    console.log("Boost generated");
    const randomPos = randomPosOnScreen(game.players);
    game.addBoost(randomPos);
    boostTimer = 0;
  }

  io.emit("update", { players: game.players, bullets: game.bullets, boosts: game.boosts });
}, TICK_RATE / 1000);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
