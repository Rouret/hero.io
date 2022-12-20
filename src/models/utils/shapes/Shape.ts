import Coordinate from "../Coordinate";

export default interface Shape {
    isInside(objectCoordinate: Coordinate,
             playerCoordinate: Coordinate,
             playerAngle: number): boolean;
}