import Player from "../Player";
import Coordinate from "../utils/Coordinate";
import Dimension from "../utils/Dimension";
import Game from "../Game";
import Spell from "../utils/spells/Spell";
import SemiCircleShape from "../utils/shapes/SemiCircleShape";
import PushBackEffect from "../utils/effects/PushBackEffect";
import CircleShape from "../utils/shapes/CircleShape";
import RectangleShape from "../utils/shapes/RectangleShape";
import HealEffect from "../utils/effects/HealEffect";
import BlockEffect from "../utils/effects/BlockEffect";
import Dash from "../utils/specials/Dash";
import {SpellType} from "../utils/spells/SpellType";
import {SpellAction} from "../utils/spells/SpellAction";

export default class Warrior extends Player {
    static hp = 140;
    static speed = 4;

    constructor(
        id: string,
        name: string,
        coordinate: Coordinate,
        size: number,
        window: Dimension
    ) {
        const basicAttackSpell = new Spell(
            "Sword strike",
            "PushBack the enemies in front of you",
            1.25,
            1.25,
            10,
            new SemiCircleShape(50),
            new PushBackEffect(),
            SpellType.onCharacter,
            SpellAction.basicAttack
        );

        const firstSpell = new Spell(
            "Sword swing",
            "PushBack the enemies around you",
            0.75,
            4,
            40,
            new CircleShape(50),
            new PushBackEffect(),
            SpellType.onCharacter,
            SpellAction.spell1
        );

        const secondSpell = new Spell(
            "Sword slash",
            "Heal yourself (1% of each enemy's hp)",
            1,
            2.5,
            15,
            new RectangleShape(125, 25),
            new HealEffect(),
            SpellType.onCharacter,
            SpellAction.spell2
        );

        const spells = [firstSpell, secondSpell];

        const special = new Dash(
            "Dash for my life",
            "Dash forward (block all incoming damage during the dash)",
            15,
            200,
            new BlockEffect(),
            SpellType.onCharacter,
            SpellAction.special
        );


        super(id, name, Warrior.hp, basicAttackSpell, spells, special, coordinate, Warrior.speed, size, window);
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