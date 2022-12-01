class Boost {
    constructor(id, window, type, color, randomPosOnScreen) {
        this.id = id;
        this.type = type;
        this.color = color;
        this.x = randomPosOnScreen.x;
        this.y = randomPosOnScreen.y;
        this.size = 25;
        this.clientDim = {
            width: window.width,
            height: window.height,
        };
    }

    isCollidingWith(players) {
        for (let player of players) {
            if (
                player.player.id !== this.id &&
                player.current.x >= this.x - this.size / 2 &&
                player.current.x <= this.x + this.size / 2 &&
                player.current.y >= this.y - this.size / 2 &&
                player.current.y <= this.y + this.size / 2
            ) {
                return player;
            }
        }
        return null;
    }
}

module.exports = Boost;
