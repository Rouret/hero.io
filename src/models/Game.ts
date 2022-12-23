import Dimension from './utils/Dimension';
import Coordinate from './utils/Coordinate';
import Warrior from "./professions/Warrior";
import {Player, ProfessionType} from "./Player";
import Spell from "./utils/spells/Spell";
import Special from "./utils/specials/Special";
import SemiCircleShape from "./utils/shapes/SemiCircleShape";
import {PushBackEffect, PushBackType} from "./utils/effects/PushBackEffect";
import {SpellType} from "./utils/spells/SpellType";
import {SpellAction} from "./utils/spells/SpellAction";
import CircleShape from "./utils/shapes/CircleShape";
import RectangleShape from "./utils/shapes/RectangleShape";
import {HealEffect, HealType} from "./utils/effects/HealEffect";
import SpellProfession from "./utils/SpellProfession";
import Dash from "./utils/specials/Dash";
import BlockEffect from "./utils/effects/BlockEffect";

export default class Game {
    players: Player[];
    spells: Array<SpellProfession> = [];
    specials: Array<Special> = [];
    worldDimension: Dimension;

    constructor() {
        this.players = [];
        this.worldDimension = new Dimension(3000, 3000);
        this._registerSpells()
    }

    addPlayer(id: string, window: Dimension, name: string) {
        //const playerCoordinate = new Coordinate(random(0, this.worldDimension.width), random(0, this.worldDimension.height))
        //DEBUG
        const playerCoordinate = new Coordinate(Math.floor(this.worldDimension.width / 2), Math.floor(this.worldDimension.width / 2))
        const player = new Warrior(id, name, playerCoordinate, 50, window, this.getSpellProfession(ProfessionType.warrior).spells, this.getSpellProfession(ProfessionType.warrior).special);
        this.players.push(player);
        return player;
    }

    getSpellProfession(profession: ProfessionType): SpellProfession {
        return this.spells.find(spellProfession => spellProfession.professionType === profession);
    }

    _registerSpells() {
        this._registerWarriorSpells();
    }

    _registerWarriorSpells() {
        const basicAttackSpell = new Spell(
            "Sword strike",
            "PushBack the enemies in front of you",
            1.25,
            1.25,
            10,
            new SemiCircleShape(50),
            new PushBackEffect(PushBackType.pushBack1),
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
            new PushBackEffect(PushBackType.pushBack1),
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
            new HealEffect(HealType.sustain, null),
            SpellType.onCharacter,
            SpellAction.spell2
        );

        const special = new Dash(
            "Dash for my life",
            "Dash forward (block all incoming damage during the dash)",
            15,
            200,
            new BlockEffect(),
            SpellType.onCharacter,
            SpellAction.special
        );

        this.spells.push(
            new SpellProfession(ProfessionType.warrior, [basicAttackSpell, firstSpell, secondSpell], special)
        );

    }
}
