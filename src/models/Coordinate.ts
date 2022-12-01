export default class Coordinate {
    x: number;
    y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    applyVector(vector) {
this.x += vector.x;
        this.y += vector.y;

    }
}