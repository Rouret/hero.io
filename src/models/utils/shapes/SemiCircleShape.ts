import Shape from "./Shape";
import Coordinate from "../Coordinate";
import Vector from "../Vector";

export default class SemiCircleShape implements Shape {
    public radius: number;
    name = "SemiCircleShape";

    public constructor(radius: number) {
        this.radius = radius
    }

    isInside(
        objectCoordinate: Coordinate,
        playerCoordinate: Coordinate,
        playerAngle: number
    ): boolean {
        const directorVector = Vector
            .factoryWithMagnitudeAndAngle(
                this.radius,
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

        const angle = Math.acos(
            (directorVector.x * playerVector.x + directorVector.y * playerVector.y) /
            (directorVector.getMagnitude() * playerVector.getMagnitude())
        );

        return angle <= Math.PI / 2;
    }
}