class Player {
    constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.mouse = {
            x: 0,
            y: 0
        }
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.speed = 1;
    }
}

module.exports = Player;