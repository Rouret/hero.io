import Dimension from './utils/Dimension';
import Coordinate from './utils/Coordinate';
import Warrior from "./professions/Warrior";
import {Player} from "./Player";

export default class Game {
    static tickrate: number;
    players: Player[];
    worldDimension: Dimension;

    constructor(tickrate: number) {
        this.players = [];
        this.worldDimension = new Dimension(3000, 3000);
        Game.tickrate = tickrate;
    }

    addPlayer(id: string, window: Dimension, name: string) {
        //const playerCoordinate = new Coordinate(random(0, this.worldDimension.width), random(0, this.worldDimension.height))
        //DEBUG
        const playerCoordinate = new Coordinate(Math.floor(this.worldDimension.width / 2), Math.floor(this.worldDimension.width / 2))
        const player = new Warrior(id, name, playerCoordinate, 50, window);
        this.players.push(player);
        return player;
    }


}
