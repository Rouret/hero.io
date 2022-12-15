import Player from './Player';
import Bullet from './Bullet';
import Boost from "./Boost";
import { randomPosOnScreen, getRandomColor, random } from '../utils';
import { getRandomBoostType} from './BoostTypes';
import Dimension from './Dimension';
import Coordinate from './Coordinate';

export default class Game {
  players: Player[];
  bullets: Bullet[];
  boosts: Boost[];
  worldDimension: Dimension;

  constructor() {
    this.players = [];
    this.bullets = [];
    this.boosts = [];
    this.worldDimension = new Dimension(4000, 4000);
  }

  addPlayer(id, window, name) {
    const playerCoordinate = new Coordinate(random(0, this.worldDimension.width), random(0, this.worldDimension.height))
    const player = new Player(id, window, name, playerCoordinate);
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
