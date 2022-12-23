import {Player, ProfessionType} from "../Player";
import Coordinate from "../utils/Coordinate";
import Dimension from "../utils/Dimension";
import Game from "../Game";
import Spell from "../utils/spells/Spell";
import Special from "../utils/specials/Special";

export default class Warrior extends Player {
    static hp = 140;
    static speed = 4;

    constructor(
        id: string,
        name: string,
        coordinate: Coordinate,
        size: number,
        window: Dimension,
        spells: Array<Spell>,
        special: Special
    ) {
        super(id, ProfessionType.warrior, name, Warrior.hp, coordinate, Warrior.speed, size, window, spells, special);
    }


    basicAttack(players: Array<Player>): void {
    }

    firstSpell(players: Array<Player>): void {
    }

    move(game: Game): Player {
        this._defaultMove(game);
        return this;
    }

    secondSpell(players: Array<Player>): void {
    }

    specialSpell(players: Array<Player>): void {
    }


}