import express from "express";
import path from "path";
import http from "http";
import {Server, Socket} from "socket.io";
import Game from "./models/Game";
import {calcVector, getDistanceOfVector, random,} from "./utils";
import Coordinate from "./models/Coordinate";
import Player from "./models/Player";
import Bullet from "./models/Bullet";

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
    taskLoop: Array<() => void>;
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
            const vector = calcVector(
                bullet.current.x,
                bullet.current.y,
                bullet.end.x,
                bullet.end.y
            );
            const distance = getDistanceOfVector(vector);

            const coef = distance / bullet.speed;
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
            const bulletCollided = player.isCollidingWith(this.game.bullets);
            if (bulletCollided !== null) {
                const playerId = bulletCollided.player.id;

                this.game.players.find((p) => p.id !== playerId).score++;

                const playerCoordinate = new Coordinate(
                    random(0, this.game.worldDimension.width),
                    random(0, this.game.worldDimension.height)
                );
                player.coordinate = playerCoordinate;
                player.removeEffect();
            }
            const boostCollided = player.isCollidingWithBoost(this.game.boosts);
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
        // this._boostTimer++;
        // if (this._boostTimer >= this.boostInterval) {
        //   const randomPos = randomPosOnScreen(this.game.players);
        //   this.game.addBoost(randomPos);
        //   this._boostTimer = 0;
        // }
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
                    data.name.slice(0, 15)
                );

                socket.emit("welcome", {
                    worldDimension: this.game.worldDimension,
                    currentPlayer: currentPlayer,
                });
            });

            //send the players object to the new player
            this.io.emit("update", {players: this.game.players});

            socket.on("moving", (rotation) => {
                if (currentPlayer === undefined) return;
                currentPlayer.move(rotation, this.game);
                currentPlayer.isMoving = true;
            });

            socket.on("shoot", (rotation: number) => {
                if (currentPlayer === undefined) return;
                const bulletCoordinate = new Coordinate(
                    currentPlayer.coordinate.x + Math.cos(rotation) * Bullet.ttl,
                    currentPlayer.coordinate.y - Math.sin(rotation) * Bullet.ttl
                );

                if (
                    bulletCoordinate.x < 0 ||
                    bulletCoordinate.x > this.game.worldDimension.width ||
                    bulletCoordinate.y < 0 ||
                    bulletCoordinate.y > this.game.worldDimension.height
                ) {
                    return;
                }

                this.game.addBullet(currentPlayer.coordinate, bulletCoordinate, currentPlayer);
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

            const playersToSend = this.game.players
                .map((p) => {
                    if (p.isMoving) return p;
                    p.move(p.rotation, this.game);
                    return p
                })

            this.io.emit("update", {
                players: playersToSend,
                bullets: this.game.bullets,
                boosts: this.game.boosts,
            });
            this.game.players.map((p) => p.isMoving = false);
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
