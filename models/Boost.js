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
}

module.exports = Boost;
