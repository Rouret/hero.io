import Player from './Player';
import Bullet from './Bullet';
import Boost from "./Boost";
import {randomPosOnScreen, getRandomColor} from '../utils';
import { getRandomBoostType} from './BoostTypes';

export default class Game {
  players: Player[];
  bullets: Bullet[];
  boosts: Boost[];

  constructor() {
    this.players = [];
    this.bullets = [];
    this.boosts = [];
  }

  addPlayer(id, window, name) {
    const player = new Player(id, window, name);
    this.players.push(player);
    return player;
  }

  addBullet(currentX, currentY, endX, endY, player) {
    const bullet = new Bullet(currentX, currentY, endX, endY, player);
    this.bullets.push(bullet);
  }

  addBoost(window) {
    const boost = new Boost(this.boosts.length+1, window, getRandomBoostType(), getRandomColor(), randomPosOnScreen(this.players));
    this.boosts.push(boost);
  }

  filterBullet() {
    this.bullets = this.bullets.filter((b) => b.isAlive);
  }
}
