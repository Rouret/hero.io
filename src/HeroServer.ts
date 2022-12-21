import express from "express";
import path from "path";
import http from "http";
import {Server, Socket} from "socket.io";
import Game from "./models/Game";
import Player from "./models/Player";
import SpellInvocation from "./models/utils/spells/SpellInvocation";
import SpecialInvocation from "./models/utils/specials/SpecialInvocation";
import Dimension from "./models/utils/Dimension";

export default class HeroServer {
    app: express.Application;
    server: http.Server;
    io: Server;
    game: Game;
    port: number;
    publicFolder: string;
    viewsFolder: string;
    tickrate: number;
    taskLoop: Array<() => void>;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.game = new Game();
        this.port = 3000;
        this.publicFolder = "../dist";
        this.viewsFolder = "../views";
        this.tickrate = 60;
        this.taskLoop = [this._loopPlayers];
    }

    _loopPlayers() {
        this.game.players = this.game.players
            .map((p) => {
                p.move(this.game)
                return p;
            })
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

            socket.on("moving", (rotation) => {
                if (currentPlayer === undefined) return;
                currentPlayer.rotation = rotation;
            });

            socket.on("spell", (spellInvocation: SpellInvocation) => {
                if (currentPlayer === undefined) return;
                console.log("spell:", spellInvocation.spell.name);
            });

            socket.on("special", (specialInvocation: SpecialInvocation) => {
                if (currentPlayer === undefined) return;
                console.log("special:", specialInvocation.special.name);
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
                players: this.game.players.map((p) => p.move(this.game)),
            });
        }, 1000 / this.tickrate);
    }

    start() {
        this._setupExpress();

        this._setupSocket();

        this._startGameLoop();

        //debug
        this.game.addPlayer("test", new Dimension(1920, 1080), "test");

        this.server.listen(this.port, () => {
            console.log(`listening on *:${this.port}`);
        });
    }
}
