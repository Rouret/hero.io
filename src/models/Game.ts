import Player from './Player';
import Bullet from './Bullet';
import Boost from "./Boost";
import {getRandomColor, random, randomPosOnScreen} from '../utils';
import {getRandomBoostType} from './BoostTypes';
import Dimension from './Dimension';
import Coordinate from './Coordinate';

export default class Game {
    players: Player[];
    bullets: Bullet[];
    boosts: Boost[];
    worldDimension: Dimension;

    constructor() {
        this.players = [];
        this.bullets = [];
        this.boosts = [];
        this.worldDimension = new Dimension(3000, 3000);
    }

    addPlayer(id, window, name) {
        const playerCoordinate = new Coordinate(random(0, this.worldDimension.width), random(0, this.worldDimension.height))
        const player = new Player(id, window, name, playerCoordinate);
        this.players.push(player);
        return player;
    }

    addBullet(start: Coordinate, end: Coordinate, player) {
        this.bullets.push(new Bullet(start, end, player));
    }

    addBoost(window) {
        const boost = new Boost(this.boosts.length + 1, window, getRandomBoostType(), getRandomColor(), randomPosOnScreen(this.players));
        this.boosts.push(boost);
    }

    filterBullet() {
        this.bullets = this.bullets.filter((b) => b.isAlive);
    }
}
