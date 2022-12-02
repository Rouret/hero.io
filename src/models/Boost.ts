export default class Boost {
    id: string;
    type: string;
    color: string;
    size: number;
    x: number;
    y: number;
    clientDim: any;

    constructor(id, window, type, color, randomPosOnScreen) {
        this.id = id;
        this.type = type;
        this.color = color;
        this.x = randomPosOnScreen.x;
        this.y = randomPosOnScreen.y;
        this.size = 10;
        this.clientDim = {
            width: window.width,
            height: window.height,
        };
    }
}
