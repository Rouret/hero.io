import Coordinate from "./utils/Coordinate";
import Dimension from "./utils/Dimension";
import Game from "./Game";
import Spell from "./utils/spells/Spell";
import Special from "./utils/specials/Special";
import BlockEffect from "./utils/effects/BlockEffect";
import SpellInvocation from "./utils/spells/SpellInvocation";
import {Effect} from "./utils/effects/Effect";

export enum ProfessionType {
    warrior = "warrior",
}


export abstract class Player {
    public id: string;
    public professionType: ProfessionType;
    public name: string;
    public speed: number;
    public size: number;
    public hp: number;
    public spells: Array<Spell> = [];
    public special: Special;

    public currentEffect: Effect = null;
    public coordinate: Coordinate;
    public initSpeed: number;
    public initHp: number;
    public score: number;
    public rotation: number;
    public clientDimension: Dimension;
    public onCast = false;

    protected constructor(
        id: string,
        profession: ProfessionType,
        name: string,
        hp: number,
        coordinate: Coordinate,
        speed: number,
        size: number,
        window: Dimension,
    ) {
        this.id = id;
        this.professionType = profession;
        this.name = name;
        this.hp = hp;

        this.coordinate = coordinate;
        this.speed = speed;
        this.size = size;
        this.clientDimension = window;

        this.initSpeed = this.speed;
        this.initHp = this.hp;
        this.score = 0;
        this.rotation = 0;
        this.onCast = false;

        this.spells = this._registerSpells();
        this.special = this._registerSpecial();
    }

    public abstract move(game: Game): Player;

    public castSpell(spellInvocation: SpellInvocation, game: Game) {
        if (this.onCast) return
        const spell = this.getSpellById(spellInvocation.spell.id);
        if (spell) {
            this.onCast = true;
            spell.cast(game, this, spellInvocation.coordinate);
        }
    }

    public castSpecial(specialInvocation, game: Game): void {

    }

    public takeDamage(damage: number): void {
        if (this.currentEffect instanceof BlockEffect) return

        if (this.hp - damage <= 0) {
            this.hp = 0;
        } else {
            this.hp -= damage;
        }
    }

    public heal(heal: number): void {
        this.hp += heal;
    }

    tick(game: Game): void {
        //Update spells
        this.spells.forEach(spell => spell.update(game, this))

        //Check if player is on cast
        if (this.onCast) {
            //Info: filter break the reference
            const spellsOnCast = this.spells.filter(spell => spell.onCast)
            //TODO SPECIAL

            if (spellsOnCast.length === 0) {
                this.onCast = false;
            }
        }

        //Move player
        this.move(game)
    }

    public getSpellById(id: string): Spell {
        return this.spells.find(s => s.id === id);
    }


    protected abstract _registerSpells(): Array<Spell>;

    protected abstract _registerSpecial(): Special;

    protected _defaultMove(game: Game): void {
        const newPlayerCoordinate = new Coordinate(
            this.coordinate.x + this.speed * Math.cos(this.rotation),
            this.coordinate.y + this.speed * Math.sin(this.rotation)
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
