const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Player = require('./models/Player');

const PORT = process.env.PORT || 3000;
const PUBLIC_FOLDER = "public";
const VIEWS_FOLDER = "views";

var players = [];

app.use(express.static(path.join(__dirname, PUBLIC_FOLDER)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, VIEWS_FOLDER, 'index.html'));
});

io.on('connection', (socket) => {
    //create a new player and add it to our players array
    var currentPlayer = new Player(socket.id);
    players.push(currentPlayer);

    console.log(`New player connected: ${socket.id}, current players: ${players.length}`);

    //send the players object to the new player
    io.emit('update', { players: players });

    socket.on('moving', (playerMouvementInformation) => {
        currentPlayer.mouse = playerMouvementInformation;
    });

    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        console.log(`Player disconnected: ${socket.id}, current players: ${players.length}`);
    });
});

var int = setInterval(() => {
    if (players.length == 0) return;
    players.forEach(player => {
        var vector = {
            x: player.mouse.x - player.x,
            y: player.mouse.y - player.y
        }
        var distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y)

        var coef = distance / player.speed;

        if (coef > 1) {
            player.x += vector.x / coef;
            player.y += vector.y / coef;
        }
    });
    io.emit('update', { players: players });
}, 30 / 1000);

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});