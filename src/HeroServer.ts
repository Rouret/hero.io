import express from "express";
import path from "path";
import http from "http";
import {Server, Socket} from "socket.io";
import Game from "./models/Game";
import {Player} from "./models/Player";
import SpellInvocation from "./models/utils/spells/SpellInvocation";
import SpecialInvocation from "./models/utils/specials/SpecialInvocation";
import Dimension from "./models/utils/Dimension";
import {removeAllPrivateProperties} from "./utils";

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
        this.port = 3000;
        this.publicFolder = "../dist";
        this.viewsFolder = "../views";
        this.tickrate = 60;
        this.game = new Game(this.tickrate);
        this.taskLoop = [this._loopPlayers];
    }

    _loopPlayers() {
        this.game.players = this.game.players.map((p) => {
            if (p.id === "test") return p
            p.tick(this.game);
            return p
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

            let currentPlayer: Player;

            socket.on("init", (data) => {
                currentPlayer = this.game.addPlayer(
                    socket.id,
                    data.window,
                    data.name.slice(0, 15)
                );
                //TODO: Use CALLBACK from socket io
                // https://socket.io/docs/v3/emitting-events/#basic-emit
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
                currentPlayer.castSpell(spellInvocation, this.game);
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

            let payload = {
                players: this.game.players,
            }

            payload = removeAllPrivateProperties(payload)

            this.io.emit("update", payload);
        }, 1000 / this.tickrate);
    }

    start() {
        this._setupExpress();

        this._setupSocket();

        this._startGameLoop();

        this.game.addPlayer("test", new Dimension(1000, 1000), "test");

        this.server.listen(this.port, () => {
            console.log(`listening on *:${this.port}`);
        });
    }
}
