import io from "socket.io-client";
import Bullet from "../models/Bullet";
import Boost from "../models/Boost";
import Player from "../models/Player";
import Dimension from "../models/Dimension";
import Coordinate from "../models/Coordinate";
import {calcVector, getDistanceOfVector} from "../utils";

const socket = io();

const canvas: HTMLCanvasElement = document.getElementById(
    "app"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");


//GAME SETUP
type GameState = {
    needToDraw: boolean;
    players: Player[];
    bullets: Bullet[];
    boosts: Boost[];
};
let mouse = new Coordinate(0, 0);
let frameIndex = 0;
let username;
let currentPlayer: Player;
let worldDimension: Dimension;

//HTML elements
const elName: HTMLInputElement = document.getElementById(
    "name"
) as HTMLInputElement;
const elLanding: HTMLDivElement = document.getElementById(
    "landing"
) as HTMLDivElement;
const playerRunImage = document.getElementById(
    "player_run"
) as HTMLImageElement;
const elButton: HTMLButtonElement = document.getElementById(
    "start"
) as HTMLButtonElement;

//from the server
let gameState: GameState = {
    needToDraw: false,
    players: [],
    bullets: [],
    boosts: [],
};
//local mouse position
const gameSettings = {
    showMiniMap: true,
    showLeaderboard: false,
    bullets: false,
    players: true,
    boosts: false,
    limitWall: 20,
    fps: 60,
    timePerTick: 0, //calculated in init
    BACKGROUND_COLOR: "#fff",
    cheat: true,
    assets: {
        bulletImage: document.getElementById("bullet") as HTMLImageElement,
        gunImage: document.getElementById("gun") as HTMLImageElement
    },
    player: {
        animation: {
            playerRunImageWidth: 280,
            playerRunImageHeight: 40,
            playerRunImageFrame: 7,
            playerRunImageFrameWidth: 0, //calculated in init
            playerRunImageFrameY: 0,
        }
    },
    minimap: {
        miniMapSize: 400,
        miniMapRatio: 0.05
    }
}

//Listeners landing page
elButton.addEventListener("click", goLesFumer);
elName.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        goLesFumer();
    }
});

function goLesFumer() {
    username = elName.value;
    if (username.length === 0) {
        username = "Unknown";
    }
    elLanding.style.display = "none";
    canvas.style.display = "block";

    init();
}

//Draw
function drawPlayer(player: Player) {
    const coefAceSpped = Math.floor(player.speed / player.initSpeed);
    const ajustedFPS = Math.floor(gameSettings.fps / coefAceSpped);
    const ajustedFrameIndex = frameIndex % ajustedFPS;

    const playerRunImageFrameIndex = Math.floor(
        (ajustedFrameIndex * (gameSettings.player.animation.playerRunImageFrame - 1)) / ajustedFPS
    );

    const playerRunImageFrameX =
        playerRunImageFrameIndex * gameSettings.player.animation.playerRunImageFrameWidth;

    ctx.save();
    ctx.translate(player.coordinate.x, player.coordinate.y);
    if (Math.abs(player.rotation) > Math.PI / 2) {
        ctx.scale(-1, 1);
    }
    ctx.drawImage(
        playerRunImage,
        playerRunImageFrameX,
        gameSettings.player.animation.playerRunImageFrameY,
        gameSettings.player.animation.playerRunImageFrameWidth,
        gameSettings.player.animation.playerRunImageHeight,
        -player.size / 2,
        -player.size / 2,
        player.size,
        player.size
    );
    ctx.restore();

    //draw gun
    ctx.save();
    ctx.translate(player.coordinate.x, player.coordinate.y);
    ctx.rotate(player.rotation);
    ctx.drawImage(gameSettings.assets.gunImage, -player.size / 2, -player.size / 2, 40, 20);

    ctx.restore();

    //draw line between player and mouse
    if (gameSettings.cheat) {
        ctx.beginPath();
        ctx.moveTo(player.coordinate.x, player.coordinate.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(
        player.name,
        player.coordinate.x - player.name.length * 5,
        player.coordinate.y - player.size / 2 - 10
    );
}

function drawBullet(bullet: Bullet) {
    console.log(bullet);
    const currentCoordinateCanvas = convertToCanvasCoordinate(
        bullet.current,
        currentPlayer
    );

    const endCoordinateCanvas = convertToCanvasCoordinate(
        bullet.end,
        currentPlayer
    );
    ctx.save();
    ctx.translate(currentCoordinateCanvas.x, currentCoordinateCanvas.y);
    ctx.drawImage(gameSettings.assets.bulletImage, 0, 0, bullet.size, bullet.size);
    ctx.restore();

    //draw a line from the player to the bullet
    if (gameSettings.cheat) {
        ctx.beginPath();
        ctx.moveTo(currentCoordinateCanvas.x, currentCoordinateCanvas.y);
        ctx.lineTo(endCoordinateCanvas.x, endCoordinateCanvas.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
}

function drawBoost(boost: Boost) {
    ctx.fillStyle = boost.color;
    const saveFillStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.fillStyle = boost.color;
    ctx.arc(boost.x, boost.y, boost.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = saveFillStyle;
}

function drawLeaderboard() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Leaderboard", 10, 50);
    ctx.font = "20px Arial";
    gameState.players.forEach((player, index) => {
        ctx.fillText(
            `${index + 1}. ${player.name}: ${player.score}`,
            10,
            80 + index * 30
        );
    });
}

function drawMiniMap() {
    const miniMapPlayerSize = currentPlayer.size * gameSettings.minimap.miniMapRatio;
    const miniMapPlayerX = currentPlayer.coordinate.x * gameSettings.minimap.miniMapRatio;
    const miniMapPlayerY = currentPlayer.coordinate.y * gameSettings.minimap.miniMapRatio;

    //Mini map
    ctx.save();
    ctx.translate(canvas.width - gameSettings.minimap.miniMapSize, canvas.height - gameSettings.minimap.miniMapSize);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, gameSettings.minimap.miniMapSize, gameSettings.minimap.miniMapSize);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameSettings.minimap.miniMapSize, 1);
    ctx.fillRect(0, 0, 1, gameSettings.minimap.miniMapSize);
    ctx.fillRect(gameSettings.minimap.miniMapSize - 1, 0, 1, gameSettings.minimap.miniMapSize);
    ctx.fillRect(0, gameSettings.minimap.miniMapSize - 1, gameSettings.minimap.miniMapSize, 1);

    //Client scrren
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(
        miniMapPlayerX - (canvas.width * gameSettings.minimap.miniMapRatio) / 2,
        miniMapPlayerY - (canvas.height * gameSettings.minimap.miniMapRatio) / 2,
        canvas.width * gameSettings.minimap.miniMapRatio,
        canvas.height * gameSettings.minimap.miniMapRatio
    );

    //CurrentPlayer
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(miniMapPlayerX, miniMapPlayerY, miniMapPlayerSize, 0, 2 * Math.PI);
    ctx.closePath();

    ctx.fill();
    ctx.restore();
}

function drawMap() {
    const topLeft = new Coordinate(
        currentPlayer.coordinate.x - canvas.width / 2,
        currentPlayer.coordinate.y - canvas.height / 2
    );
    const topRight = new Coordinate(
        currentPlayer.coordinate.x + canvas.width / 2,
        currentPlayer.coordinate.y - canvas.height / 2
    );
    const bottomRight = new Coordinate(
        currentPlayer.coordinate.x + canvas.width / 2,
        currentPlayer.coordinate.y + canvas.height / 2
    );
    const bottomLeft = new Coordinate(
        currentPlayer.coordinate.x - canvas.width / 2,
        currentPlayer.coordinate.y + canvas.height / 2
    );

    //draw map limit if the canvas is out of the map
    if (topLeft.x < 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, -topLeft.x, canvas.height);

    }
    if (topLeft.y < 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, -topLeft.y);

    }
    if (bottomRight.x > worldDimension.width) {
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width - (bottomRight.x - worldDimension.width), 0, bottomRight.x - worldDimension.width, canvas.height);
    }
    if (bottomRight.y > worldDimension.height) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, canvas.height - (bottomRight.y - worldDimension.height), canvas.width, bottomRight.y - worldDimension.height);
    }
}

function draw() {
    if (frameIndex === gameSettings.fps) {
        frameIndex = 0;
    } else {
        frameIndex++;
    }
    if (gameState.needToDraw) {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background
        ctx.fillStyle = gameSettings.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw players
        if (gameSettings.players) {
            gameState.players.forEach(drawPlayer);
        }

        //draw bullets
        if (gameSettings.bullets) {
            gameState.bullets.forEach(drawBullet);
        }

        //draw boosts if gameSettings.boosts is true
        if (gameSettings.boosts) {
            gameState.boosts.forEach(drawBoost);
        }

        drawMap();

        if (gameSettings.showMiniMap) {
            drawMiniMap();
        }

        if (gameSettings.showLeaderboard) {
            drawLeaderboard();
        }

        gameState.needToDraw = false;
    }
}

function convertToCanvasCoordinate(
    objectCoordinate: Coordinate,
    currentPlayer: Player
): Coordinate {
    const x =
        objectCoordinate.x - (currentPlayer.coordinate.x - canvas.width / 2);
    const y =
        objectCoordinate.y - (currentPlayer.coordinate.y - canvas.height / 2);
    return new Coordinate(x, y);
}

function convertToGameCoordinate(
    objectCoordinate: Coordinate,
    currentPlayer: Player
): Coordinate {
    const x =
        objectCoordinate.x + (currentPlayer.coordinate.x - canvas.width / 2);
    const y =
        objectCoordinate.y + (currentPlayer.coordinate.y - canvas.height / 2);
    return new Coordinate(x, y);
}


function getRotationByClick(event) {
    mouse = new Coordinate(event.clientX, event.clientY);
    const mouseWorldCoordinate = convertToGameCoordinate(
        mouse,
        currentPlayer
    );

    const vector = calcVector(
        currentPlayer.coordinate.x,
        currentPlayer.coordinate.y,
        mouseWorldCoordinate.x,
        mouseWorldCoordinate.y
    );

    let rotation = Math.acos(vector.x / getDistanceOfVector(vector));
    if (vector.y > 0) {
        rotation = -rotation;
    }

    return rotation;
}

function init() {
    //SETUP
    canvas.width = window.document.documentElement.clientWidth;
    canvas.height = window.document.documentElement.clientHeight - 1;
    //Calculate
    gameSettings.player.animation.playerRunImageFrameWidth = gameSettings.player.animation.playerRunImageWidth / gameSettings.player.animation.playerRunImageFrame
    gameSettings.timePerTick = 1000 / gameSettings.fps;

    if (gameSettings.players) {
        canvas.addEventListener(
            "mousemove",
            function (event) {
                socket.emit("moving", getRotationByClick(event));
            },
            false
        );
    }

    //Shoot Event
    if (gameSettings.bullets) {
        document.addEventListener("keyup", (event) => {
            if (event.key === " ") {
                socket.emit("shoot", {x: mouse.x, y: mouse.y});
            }
        });

        canvas.addEventListener(
            "click",
            function (event) {
                socket.emit("shoot", getRotationByClick(event));
            },
            false
        );
    }

    //IO
    socket.emit("init", {
        window: new Dimension(canvas.width, canvas.height),
        name: username,
    });

    socket.on("welcome", (metadataFromServer) => {
        console.log("MetaData from server: ", metadataFromServer);
        currentPlayer = metadataFromServer.currentPlayer;
        worldDimension = metadataFromServer.worldDimension;
        gameSettings.minimap.miniMapRatio = gameSettings.minimap.miniMapSize / worldDimension.width;
    });

    socket.on("update", (gameStateFromServer) => {
        gameState = {...gameStateFromServer};

        if (gameSettings.players) {
            currentPlayer = Object.assign(
                {},
                gameState.players.find((player) => player.id === currentPlayer.id)
            );

            gameState.players.map((player) => {
                player.coordinate = convertToCanvasCoordinate(
                    player.coordinate,
                    currentPlayer
                );

                return player;
            });
        }

        if (gameSettings.bullets) {
            gameState.bullets.map((bullet) => {
                bullet.current = convertToCanvasCoordinate(bullet.current, currentPlayer);
                bullet.end = convertToCanvasCoordinate(bullet.end, currentPlayer); //only for cheat
                return bullet;
            });
        }

        gameState.needToDraw = true;
        draw();
    });

    if (canvas.getContext("2d")) {
        console.log("Game is ready 😊");
        setInterval(draw, gameSettings.timePerTick);
    }
}
