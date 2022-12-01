export default class Bullet {
  current: any;
  player: any;
  end: any;
  color: any;
  speed: number;
  isAlive: boolean;
  
  constructor(startX, startY, endX, endY, player) {
    this.current = {
      x: startX,
      y: startY,
    };
    this.player = player;
    this.end = {
      x: endX,
      y: endY,
    };
    this.color = this.player.color;
    this.speed = 5;
    this.isAlive = true;
  }
}