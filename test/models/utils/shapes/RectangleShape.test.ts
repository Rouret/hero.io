import Coordinate from "../../../../src/models/utils/Coordinate";
import RectangleShape from "../../../../src/models/utils/shapes/RectangleShape";

describe("RectangleShape", () => {
    const lenght = 3;
    const width = 1;
    const playerAngle = Math.PI / 4; //45 degrees

    it("is in", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(1, 1);
        const isInside = new RectangleShape(lenght, width).isInside(objectCoordinate, playerCoordinate, playerAngle);

        expect(isInside).toBeTruthy();

    });

    it("is out", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(-1, 1);

        const isInside = new RectangleShape(lenght, width).isInside(objectCoordinate, playerCoordinate, playerAngle);

        expect(isInside).toBeFalsy();
    });
})