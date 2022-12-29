import Coordinate from "../Coordinate";

export default interface Shape {
    name: string;

    isInside(objectCoordinate: Coordinate,
             playerCoordinate: Coordinate,
             playerAngle: number): boolean;
}