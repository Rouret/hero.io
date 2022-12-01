import Player from './Player';
import Bullet from './Bullet';

const { randomPosOnScreen, getRandomColor,
} = require("../utils");
const Boost = require("./Boost");
const { getRandomBoostType} = require("./BoostTypes");

export default class Game {
  players: any[];
  bullets: any[];
  boosts: any[];

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
    let boost = new Boost(this.boosts.length+1, window, getRandomBoostType(), getRandomColor(), randomPosOnScreen(this.players));
    this.boosts.push(boost);
  }

  filterBullet() {
    this.bullets = this.bullets.filter((b) => b.isAlive);
  }
}
