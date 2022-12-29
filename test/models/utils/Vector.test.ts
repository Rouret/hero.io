import Coordinate from "../../../src/models/utils/Coordinate";
import Vector from "../../../src/models/utils/Vector";

describe("Vector", () => {
    it("factoryWithPoint", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(1, 1);
        const vector = Vector.factoryWithPoint(playerCoordinate, objectCoordinate);

        expect(vector.x).toBe(1);
        expect(vector.y).toBe(1);

    });

    it("factoryWithMagnitudeAndAngle", () => {
        const magnitude = 2;
        const radius = Math.PI / 4; //45 degrees
        const objectCoordinate = new Coordinate(1, 1);

        const vector = Vector.factoryWithMagnitudeAndAngle(magnitude, radius, objectCoordinate);

        expect(vector.x.toFixed(6)).toBe(Math.sqrt(magnitude).toFixed(6));
        expect(vector.y.toFixed(6)).toBe(Math.sqrt(magnitude).toFixed(6));
    });


    it("factoryWithPoint", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(1, 1);
        const vector = Vector.factoryWithPoint(playerCoordinate, objectCoordinate);

        expect(vector.getMagnitude().toFixed(6)).toBe(Math.sqrt(2).toFixed(6));
    });

    it("factoryWithPoint", () => {
        const playerCoordinate = new Coordinate(0, 0);
        const objectCoordinate = new Coordinate(1, 1);
        const vector = Vector.factoryWithPoint(playerCoordinate, objectCoordinate);

        expect(vector.getAngle().toFixed(6)).toBe((Math.PI / 4).toFixed(6));
    });
})