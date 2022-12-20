import Coordinate from "../Coordinate";
import Shape from "./Shape";
import Vector from "../Vector";

export default class CircleShape implements Shape {
    name = "CircleShape";
    public radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    isInside(objectCoordinate: Coordinate,
             playerCoordinate: Coordinate,
             playerAngle: number): boolean {
        const playerVector = Vector
            .factoryWithPoint(playerCoordinate, objectCoordinate);
        return playerVector.getMagnitude() <= this.radius;
    }
}