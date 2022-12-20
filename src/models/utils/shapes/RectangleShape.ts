import Shape from "./Shape";
import Coordinate from "../Coordinate";
import Vector from "../Vector";

export default class RectangleShape implements Shape {
    name = "RectangleShape";
    public length: number;
    public width: number;

    constructor(length: number, width: number) {
        this.length = length;
        this.width = width;
    }

    isInside(objectCoordinate: Coordinate, playerCoordinate: Coordinate, playerAngle: number): boolean {
        const directorVector = Vector
            .factoryWithMagnitudeAndAngle(
                this.length,
                playerAngle,
                playerCoordinate
            );
        const playerVector = Vector
            .factoryWithPoint(
                playerCoordinate,
                objectCoordinate
            );
        if (directorVector.getMagnitude() < playerVector.getMagnitude()) {
            return false;
        }
        const distanceObjectToDirector = Math.abs(
            directorVector.x * playerVector.y - directorVector.y * playerVector.x) / directorVector.getMagnitude();
        return distanceObjectToDirector <= this.width / 2;
    }

}