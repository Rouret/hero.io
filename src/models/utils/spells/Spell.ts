import Effect from "../effects/Effect";
import Shape from "../shapes/Shape";
import {SpellType} from "./SpellType";
import {SpellAction} from "./SpellAction";
import {Player} from "../../Player";
import Game from "../../Game";
import {clone, randomId} from "../../../utils";
import Coordinate from "../Coordinate";


export default class Spell {
    public id: string;
    public name: string;
    public description: string;
    public time: number;
    public cooldown: number;
    public damage: number;
    public shape: Shape;
    public effect: Effect;
    public type: SpellType;
    public action: SpellAction;
    public onCooldown: boolean;
    public onCast: boolean;
    public cooldownTime: number;
    public castTime: number;

    public _spellCoordinate: Coordinate;
    public _initPlayerRotation: number;

    public constructor(
        name: string,
        description: string,
        time: number,
        cooldown: number,
        damage: number,
        shape: Shape,
        effect: Effect,
        type: SpellType,
        action: SpellAction,
    ) {
        this.id = randomId()
        this.name = name;
        this.description = description;

        this.time = time;
        this.cooldown = cooldown;
        this.damage = damage;
        this.shape = shape;
        this.effect = effect;
        this.type = type;
        this.action = action;

        this.cooldownTime = 0;
        this.castTime = 0;
        this.onCooldown = false;
        this.onCast = false;

    }

    update(game, currentPlayer: Player) {
        if (this.onCooldown) {
            this.cooldownTime += 1;
            if (this.cooldownTime >= this.cooldown) {
                this.cooldownTime = 0;
                this.onCooldown = false;
            }
        }
        if (this.onCast) {
            this.castTime += 1;
            if (this.castTime >= this.time) {
                this.castTime = 0;
                this.endCast(game, currentPlayer);
            }
        }
    }

    cast(game: Game, currentPlayer: Player, spellCoordinate: Coordinate) {
        if (this.onCooldown || this.onCast) return;
        this.onCast = true;
        this._spellCoordinate = clone(spellCoordinate);
        this._initPlayerRotation = currentPlayer.rotation
    }

    endCast(game: Game, currentPlayer: Player) {
        //Get players in shape
        const playersHit = game.players.filter((p) => {
            if (p.id === currentPlayer.id) return false;
            if (this.type === SpellType.onCharacter) {
                return this.shape.isInside(p.coordinate, currentPlayer.coordinate, this._initPlayerRotation);
            } else {
                return this.shape.isInside(p.coordinate, this._spellCoordinate, currentPlayer.rotation);
            }
        })

        //Effect on each player
        playersHit.forEach((p) => {
            p.takeDamage(this.damage);
            this.effect.apply(p, currentPlayer);
        })

        this.onCooldown = true;
        this.onCast = false;
        this._spellCoordinate = undefined;
        this._initPlayerRotation = undefined;
    }
}
