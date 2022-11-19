class Bullet {
    constructor(startX, startY, endX, endY) {
        this.current = {
            x: startX,
            y: startY
        }

        this.end = {
            x: endX,
            y: endY
        }
        this.speed = 2;
        this.isAlive = true;
    }
}

module.exports = Bullet;