import Coordinate from "../../../../src/models/utils/Coordinate";
import SemiCircleShape from "../../../../src/models/utils/shapes/SemiCircleShape";

describe("SemiCircleShape", () => {
    const magnitude = 1;
    const playerAngle = Math.PI / 4; //45 degrees

    it("is in", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(0.5, 0.5);
        const isInside = new SemiCircleShape(magnitude).isInside(objectCoordinate, playerCoordinate, playerAngle);

        expect(isInside).toBeTruthy();

    });

    it("is out", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(-1, 1);

        const isInside = new SemiCircleShape(magnitude).isInside(objectCoordinate, playerCoordinate, playerAngle);

        expect(isInside).toBeFalsy();
    });
})