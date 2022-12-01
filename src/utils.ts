import Player from './models/Player';

export const calcVector = function (ax: number, ay: number, bx: number, by: number) {
  return {
    x: bx - ax,
    y: by - ay,
  };
};

export const getDistanceOfVector = function (vector: any) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

export const random = function (min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomPosOnScreen = function(players) {
  //TODO A enlever avec la map dynamique
  let min = minScreenSize(players);
  return {
    x: random(
        0, min.width),
    y: random(0, min.height)
  }
}

export const minScreenSize = function (players: Player[]) {
  let width = 0;
  let height = 0;
  players.forEach((player) => {
    if (player.clientDim.width > width) width = player.clientDim.width;
    if (player.clientDim.height > height) height = player.clientDim.height;
  });
  return {
    width,
    height,
  };
}

export const getRandomColor = function() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

module.exports = {
  calcVector,
  getDistanceOfVector,
  random,
  randomPosOnScreen,
  minScreenSize,
  getRandomColor,
};
