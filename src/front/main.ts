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
let moveIndex = 0;
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
const elSettingsButton: HTMLButtonElement = document.getElementById(
    "settingsSave"
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
        },
        move: {
            delay: 0//calculated in init
        },
        bind: {
            spell1: "a",
            spell2: "z",
            special: "c",
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

elSettingsButton.addEventListener("click", settingSwitch);

function settingSwitch() {
    let settingsConfig = document.getElementsByClassName(
        'settingsConfig',
      ) as HTMLCollectionOf<HTMLElement>;
    let modifyingState = true;
    let alreadySetkeys = [];

    if (settingsConfig.length === 0) {
        settingsConfig = document.getElementsByClassName(
            'settingsConfigText',
            ) as HTMLCollectionOf<HTMLElement>;
        modifyingState = false;
    }
    const elementType = !modifyingState ? "input" : "p";
    const elementClass = !modifyingState ? "settingsConfig" : "settingsConfigText";
    const arrSettings = Array.from(settingsConfig);

    arrSettings.forEach(settingConfigOld => {
        const parent = settingConfigOld.parentElement;
        const settingConfigNew = document.createElement(elementType);
        settingConfigNew.innerText = (<HTMLInputElement>settingConfigOld).value;
        settingConfigNew.classList.add(elementClass);
        settingConfigNew.setAttribute("id", settingConfigOld.id);
        if(!modifyingState){
            settingConfigNew.setAttribute("value", settingConfigOld.innerText);
            settingConfigNew.setAttribute("size", "1");
            settingConfigNew.setAttribute("maxlength", "1");
        }
        else if (settingConfigNew.innerText == "" || settingConfigNew.innerText == " " || alreadySetkeys.includes(settingConfigNew.innerText)){
            settingConfigNew.innerText = gameSettings.player.bind[settingConfigNew.id];
        }
        alreadySetkeys.push(settingConfigNew.innerText);
        parent.replaceChild(settingConfigNew, settingConfigOld);
    });
}

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
    const coefAceSpeed = Math.floor(player.speed / player.initSpeed);
    const ajustedFPS = Math.floor(gameSettings.fps / coefAceSpeed);
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

    //draw a red cirlce around the player
    if (gameSettings.cheat) {
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "green";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.strokeStyle = "blue";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 150, 0, 2 * Math.PI);
        ctx.strokeStyle = "yellow";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 200, 0, 2 * Math.PI);
        ctx.strokeStyle = "orange";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 250, 0, 2 * Math.PI);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }


    ctx.restore();

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

    if (gameSettings.cheat) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
            miniMapPlayerX - (canvas.width * gameSettings.minimap.miniMapRatio) / 2,
            miniMapPlayerY - (canvas.height * gameSettings.minimap.miniMapRatio) / 2,
            canvas.width * gameSettings.minimap.miniMapRatio,
            canvas.height * gameSettings.minimap.miniMapRatio
        );
    }

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
    const bottomRight = new Coordinate(
        currentPlayer.coordinate.x + canvas.width / 2,
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
    gameSettings.player.move.delay = Math.floor(gameSettings.fps / 10);

    if (gameSettings.players) {
        canvas.addEventListener(
            "mousemove",
            function (event) {
                if (moveIndex >= gameSettings.player.move.delay) {
                    socket.emit("moving", getRotationByClick(event));
                    moveIndex = 0;
                } else {
                    moveIndex++;
                }

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
