function calcVector(ax, ay, bx, by) {
  return {
    x: bx - ax,
    y: by - ay,
  };
}

function getDistanceOfVector(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function minScreenSize(players) {
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

module.exports = {
  calcVector,
  getDistanceOfVector,
  random,
  minScreenSize,
};
