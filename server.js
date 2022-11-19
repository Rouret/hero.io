const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const PUBLIC_FOLDER = "public";
const VIEWS_FOLDER = "views";


app.use(express.static(path.join(__dirname, PUBLIC_FOLDER)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, VIEWS_FOLDER, 'index.html'));
});

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});