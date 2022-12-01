const Player = require("./Player");
const Bullet = require("./Bullet");

const { randomPosOnScreen, getRandomColor,
} = require("../utils");
const Boost = require("./Boost");
const { getRandomBoostType} = require("./BoostTypes");

class Game {
  constructor() {
    this.players = [];
    this.bullets = [];
    this.boosts = [];
  }

  addPlayer(id, window, name, color) {
    let player = new Player(id, window, name, color);
    this.players.push(player);

    return player;
  }

  addBullet(currentX, currentY, endX, endY, player) {
    let bullet = new Bullet(currentX, currentY, endX, endY, player);
    this.bullets.push(bullet);
  }

  addBoost(window) {
    let boost = new Boost(1, window, getRandomBoostType(), getRandomColor(), randomPosOnScreen(this.players));
    this.boosts.push(boost);
  }

  filterBullet() {
    this.bullets = this.bullets.filter((b) => b.isAlive);
  }
}

module.exports = Game;
