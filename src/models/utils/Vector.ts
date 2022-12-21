import Coordinate from "./Coordinate";

export default class Vector {
    x = 0;
    y = 0;

    protected constructor(ax: number, ay: number, bx: number, by: number) {
        this.x = bx - ax;
        this.y = by - ay;
    }

    static factoryWithPoint(aCoordinate: Coordinate, bCoordinate: Coordinate) {
        return new Vector(aCoordinate.x, aCoordinate.y, bCoordinate.x, bCoordinate.y);
    }

    static factoryWithMagnitudeAndAngle(magnitude: number, radius: number, point: Coordinate) {
        return new Vector(
            point.x,
            point.y,
            point.x + magnitude * Math.cos(radius),
            point.y + magnitude * Math.sin(radius)
        );
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }
}