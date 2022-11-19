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
        console.log(`Player ${socket.id} is moving : (${playerMouvementInformation.x},${playerMouvementInformation.x})`);

        var vector = {
            x: playerMouvementInformation.x - currentPlayer.x,
            y: playerMouvementInformation.y - currentPlayer.y
        }
        var distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y)

        var coef = distance / currentPlayer.speed;
        if (coef > 1) {
            currentPlayer.x += vector.x * (1 / coef)
            currentPlayer.y += vector.y * (1 / coef)
        }

        io.emit('update', { players: players });
    });

    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        console.log(`Player disconnected: ${socket.id}, current players: ${players.length}`);
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});