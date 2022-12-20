export default class Vector {
    x: number;
    y: number;

    constructor(ax: number, ay: number, bx: number, by: number) {
        this.x = bx - ax;
        this.y = by - ay;
    }
}