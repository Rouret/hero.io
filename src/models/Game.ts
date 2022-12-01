import Player from './Player';
import Bullet from './Bullet';

export default class Game {
  players: any[];
  bullets: any[];

  constructor() {
    this.players = [];
    this.bullets = [];
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

  filterBullet() {
    this.bullets = this.bullets.filter((b) => b.isAlive);
  }
}