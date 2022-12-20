import Coordinate from "./utils/Coordinate";
import Dimension from "./utils/Dimension";
import Game from "./Game";

export default class Player {
    id: string;
    name: string;
    coordinate: Coordinate;
    speed: number;
    initSpeed: number;
    score: number;
    size: number;
    rotation: number;
    clientDimension: Dimension;

    constructor(id: string, window: Dimension, name: string, coordinate: Coordinate) {
        this.id = id;
        this.name = name;
        this.coordinate = coordinate;
        this.speed = 10;
        this.initSpeed = this.speed;
        this.score = 0;
        this.size = 50;
        this.rotation = 0;
        this.clientDimension = new Dimension(window.width, window.height);
    }

    move(game: Game) {
        const newPlayerCoordinate = new Coordinate(
            this.coordinate.x + Math.cos(this.rotation) * this.speed,
            this.coordinate.y - Math.sin(this.rotation) * this.speed
        );

        if (
            newPlayerCoordinate.x < 0 ||
            newPlayerCoordinate.x > game.worldDimension.width ||
            newPlayerCoordinate.y < 0 ||
            newPlayerCoordinate.y > game.worldDimension.height
        ) {
            return;
        }

        this.coordinate = newPlayerCoordinate;
    }

}
