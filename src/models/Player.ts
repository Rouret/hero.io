import Coordinate from "./utils/Coordinate";
import Dimension from "./utils/Dimension";
import Game from "./Game";
import Spell from "./utils/spells/Spell";
import Special from "./utils/specials/Special";
import Effect from "./utils/effects/Effect";
import BlockEffect from "./utils/effects/BlockEffect";

export default abstract class Player {
    public id: string;
    public name: string;
    public speed: number;
    public size: number;
    public hp: number;
    public basicAttackSpell: Spell;
    public spells: Array<Spell> = [];
    public special: Special;

    public currentEffect: Effect = null;
    public coordinate: Coordinate;
    public initSpeed: number;
    public score: number;
    public rotation: number;
    public clientDimension: Dimension;

    protected constructor(
        id: string,
        name: string,
        hp: number,
        coordinate: Coordinate,
        speed: number,
        size: number,
        window: Dimension
    ) {
        this.id = id;
        this.name = name;
        this.hp = hp;

        this.coordinate = coordinate;
        this.speed = speed;
        this.size = size;
        this.clientDimension = window;

        this.initSpeed = this.speed;
        this.score = 0;
        this.rotation = 0;
    }

    public abstract registerSpellAndSpecial(spells: Array<Spell>): void;

    public abstract move(game: Game): Player;

    public abstract basicAttack(players: Array<Player>): void;

    public abstract firstSpell(players: Array<Player>): void;

    public abstract secondSpell(players: Array<Player>): void;

    public abstract specialSpell(players: Array<Player>): void;

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
