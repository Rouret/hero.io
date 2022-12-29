import {Player, ProfessionType} from "../Player";
import Coordinate from "../utils/Coordinate";
import Dimension from "../utils/Dimension";
import Game from "../Game";
import Spell from "../utils/spells/Spell";
import {convertSecondToTick} from "../../utils";
import SemiCircleShape from "../utils/shapes/SemiCircleShape";
import {PushBackEffect, PushBackType} from "../utils/effects/PushBackEffect";
import {SpellType} from "../utils/spells/SpellType";
import {SpellAction} from "../utils/spells/SpellAction";
import CircleShape from "../utils/shapes/CircleShape";
import RectangleShape from "../utils/shapes/RectangleShape";
import {HealEffect, HealType} from "../utils/effects/HealEffect";
import Dash from "../utils/specials/Dash";
import BlockEffect from "../utils/effects/BlockEffect";

export default class Warrior extends Player {
    static hp = 140;
    static speed = 4;

    constructor(
        id: string,
        name: string,
        coordinate: Coordinate,
        size: number,
        window: Dimension,
    ) {
        super(id, ProfessionType.warrior, name, Warrior.hp, coordinate, Warrior.speed, size, window);
    }


    move(game: Game): Player {
        this._defaultMove(game);
        return this;
    }

    protected _registerSpells(): void {
        const autoAttack = new Spell(
            "Sword strike",
            "PushBack the enemies in front of you",
            convertSecondToTick(1.25, Game.tickrate),
            convertSecondToTick(1.25, Game.tickrate),
            10,
            new SemiCircleShape(50),
            new PushBackEffect(PushBackType.pushBack1),
            SpellType.onCharacter,
            SpellAction.basicAttack
        );

        const firstSpell = new Spell(
            "Sword swing",
            "PushBack the enemies around you",
            convertSecondToTick(0.75, Game.tickrate),
            convertSecondToTick(4, Game.tickrate),
            40,
            new CircleShape(50),
            new PushBackEffect(PushBackType.pushBack1),
            SpellType.onCharacter,
            SpellAction.spell1
        );

        const secondSpell = new Spell(
            "Sword slash",
            "Heal yourself (1% of each enemy's hp)",
            convertSecondToTick(1, Game.tickrate),
            convertSecondToTick(2.5, Game.tickrate),
            15,
            new RectangleShape(125, 25),
            new HealEffect(HealType.sustain, null),
            SpellType.onCharacter,
            SpellAction.spell2
        );

        this.spells = [autoAttack, firstSpell, secondSpell];

        this.special = new Dash(
            "Dash for my life",
            "Dash forward (block all incoming damage during the dash)",
            convertSecondToTick(15, Game.tickrate),
            200,
            new BlockEffect(),
            SpellType.onCharacter,
            SpellAction.special
        );
    }


}