import Player from './Player';
import {random} from '../utils';
import Dimension from './utils/Dimension';
import Coordinate from './utils/Coordinate';

export default class Game {
    players: Player[];
    worldDimension: Dimension;

    constructor() {
        this.players = [];
        this.worldDimension = new Dimension(3000, 3000);
    }

    addPlayer(id, window, name) {
        const playerCoordinate = new Coordinate(random(0, this.worldDimension.width), random(0, this.worldDimension.height))
        const player = new Player(id, window, name, playerCoordinate);
        this.players.push(player);
        return player;
    }
}
