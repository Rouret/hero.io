import express from "express";
import path from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import Game from "./models/Game";
import { calcVector, getDistanceOfVector, randomPosOnScreen } from "./utils";
import Coordinate from "./models/Coordinate";
import Player from "./models/Player";

export default class ShooterServer {
  app: express.Application;
  server: http.Server;
  io: Server;
  game: Game;
  port: number;
  publicFolder: string;
  viewsFolder: string;
  tickrate: number;
  boostInterval: number;
  taskLoop: any;
  _boostTimer: number;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
    this.game = new Game();
    this.port = 3000;
    this.publicFolder = "../dist";
    this.viewsFolder = "../views";
    this.tickrate = 60;
    this.boostInterval = this.tickrate;
    this._boostTimer = 0;
    this.taskLoop = [this._loopBullets, this._loopPlayers, this._loopBoosts];
  }

  _loopBullets() {
    this.game.filterBullet();
    if (this.game.players.length === 0) return;
    this.game.bullets.forEach((bullet) => {
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
        bullet.current.x = bullet.end.x;
        bullet.current.y = bullet.end.y;
        bullet.isAlive = false;
      }
    });
  }

  _loopPlayers() {
    this.game.players.forEach((player) => {
      let bulletCollided = player.isCollidingWith(this.game.bullets);
      if (bulletCollided !== null) {
        let playerId = bulletCollided.player.id;

        this.game.players.find((p) => p.id !== playerId).score++;

        let randomCoords = randomPosOnScreen(this.game.players);
        player.coordinate.x = randomCoords.x;
        player.coordinate.y = randomCoords.y;
        player.removeEffect();
      }

      let vector = calcVector(
        player.coordinate.x,
        player.coordinate.y,
        player.mouse.x,
        player.mouse.y
      );
      let distance = getDistanceOfVector(vector);

      let coef = distance / player.speed;
      if (coef > 1) {
        player.coordinate.x += vector.x / coef;
        player.coordinate.y += vector.y / coef;
      } else {
        player.coordinate.x = player.mouse.x;
        player.coordinate.y = player.mouse.y;
      }

      let boostCollided = player.isCollidingWithBoost(this.game.boosts);
      if (boostCollided !== null) {
        player.setEffect(boostCollided);
        this.game.boosts = this.game.boosts.filter(
          (b) => b.id !== boostCollided.id
        );
      }
    });
  }

  _loopBoosts() {
    // Generate boosts
    this._boostTimer++;
    if (this._boostTimer >= this.boostInterval) {
      const randomPos = randomPosOnScreen(this.game.players);
      this.game.addBoost(randomPos);
      this._boostTimer = 0;
    }
  }

  _setupExpress() {
    this.app.use(express.static(path.join(__dirname, this.publicFolder)));

    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, this.viewsFolder, "index.html"));
    });
  }

  _setupSocket() {
    this.io.on("connection", (socket: Socket) => {
      //create a new player and add it to our players array
      let currentPlayer: Player;
      // Avant de commencer le client envoie des meta donnéess
      socket.on("init", (data) => {
        currentPlayer = this.game.addPlayer(
          socket.id,
          data.window,
          data.name.slice(0, 15),
          data.color
        );
      });
      socket.emit("newPlayer", currentPlayer);
      //On envoye au client ses données

      //send the players object to the new player
      this.io.emit("update", { players: this.game.players });

      socket.on("moving", (playerMouvementInformation) => {
        if (currentPlayer === undefined) return;
        currentPlayer.mouse = new Coordinate(
          playerMouvementInformation.x,
          playerMouvementInformation.y
        );
        //calculer la rotation du joeur par rapport à la souris
        let vector = calcVector(
          currentPlayer.coordinate.x,
          currentPlayer.coordinate.y,
          currentPlayer.mouse.x,
          currentPlayer.mouse.y
        );
        currentPlayer.rotation = Math.atan2(vector.y, vector.x);
      });

      socket.on("shoot", (shootCord) => {
        this.game.addBullet(
          currentPlayer.coordinate.x,
          currentPlayer.coordinate.y,
          shootCord.x,
          shootCord.y,
          currentPlayer
        );
      });

      socket.on("disconnect", () => {
        this.game.players = this.game.players.filter((p) => p.id !== socket.id);
        console.log(
          `Player disconnected: ${socket.id}, current players: ${this.game.players.length}`
        );
      });
    });
  }

  _startGameLoop() {
    setInterval(() => {
      this.taskLoop.forEach((task) => task.call(this));
      this.io.emit("update", {
        players: this.game.players,
        bullets: this.game.bullets,
        boosts: this.game.boosts,
      });
    }, 1000 / this.tickrate);
  }

  start() {
    this._setupExpress();

    this._setupSocket();

    this._startGameLoop();

    this.server.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    });
  }
}
