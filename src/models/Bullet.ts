import Player from "./Player";
import Coordinate from "./Coordinate";

export default class Bullet {
  current: Coordinate;
  player: Player;
  end: Coordinate;
  color: string;
  speed: number;
  isAlive: boolean;
  
  constructor(startX, startY, endX, endY, player) {
    this.current = new Coordinate(startX, startY);
    this.player = player;
    this.end = new Coordinate(endX, endY);
    this.color = this.player.color;
    this.speed = 10;
    this.isAlive = true;
  }
}