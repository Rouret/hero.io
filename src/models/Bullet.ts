import Player from "./Player";
import Coordinate from "./Coordinate";

export default class Bullet {
    static ttl: number = 100;
    current: Coordinate;
    player: Player;
    end: Coordinate;
    speed: number;
    size: number;
    isAlive: boolean;

    constructor(start: Coordinate, end: Coordinate, player) {
        this.current = start;
        this.player = player;
        this.end = end;
        this.speed = 10;
        this.size = 10;
        this.isAlive = true;
    }
}