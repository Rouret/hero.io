class Player {
  constructor(id, window, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.speed = 2;
    this.score = 0;
    this.size = 30;
    this.clientDim = {
      width: window.width,
      height: window.height,
    };
  }

  isCollidingWith(bullets) {
    for (let bullet of bullets) {
      if (
        bullet.player.id !== this.id &&
        bullet.current.x >= this.x - this.size / 2 &&
        bullet.current.x <= this.x + this.size / 2 &&
        bullet.current.y >= this.y - this.size / 2 &&
        bullet.current.y <= this.y + this.size / 2
      ) {
        return bullet;
      }
    }
    return null;
  }
}

module.exports = Player;
