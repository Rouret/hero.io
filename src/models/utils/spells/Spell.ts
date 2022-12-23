import Effect from "../effects/Effect";
import Shape from "../shapes/Shape";
import {SpellType} from "./SpellType";
import {SpellAction} from "./SpellAction";
import {Player} from "../../Player";
import Game from "../../Game";
import {randomId} from "../../../utils";
import Coordinate from "../Coordinate";

export default class Spell {
    public id: string;
    public name: string;
    public description: string;
    public cooldown: number;
    public damage: number;
    public shape: Shape;
    public effect: Effect;
    public type: SpellType;
    public action: SpellAction;

    private _playersHit: Array<Player> = [];

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
        //random id
        this.id = randomId()
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.damage = damage;
        this.shape = shape;
        this.effect = effect;
        this.type = type;
        this.action = action;

    }

    cast(game: Game, currentPlayer: Player, spellCoordinate: Coordinate) {
        //get players in shape
        this._playersHit = game.players.filter((p) => {
            if (p.id === currentPlayer.id) return false;
            if (this.type === SpellType.onCharacter) {
                return this.shape.isInside(p.coordinate, currentPlayer.coordinate, currentPlayer.rotation);
            } else {
                return this.shape.isInside(p.coordinate, spellCoordinate, currentPlayer.rotation);
            }
        })

        console.log(this._playersHit.map(p => p.name))

        //Extra effect
        switch (this.action) {
            case SpellAction.basicAttack:
                currentPlayer.basicAttack(this._playersHit);
                break;
            case SpellAction.spell1:
                currentPlayer.firstSpell(this._playersHit);
                break;
            case SpellAction.spell2:
                currentPlayer.secondSpell(this._playersHit);
                break;
        }
        //Effect
        this._playersHit.forEach((p) => {
            p.takeDamage(this.damage);
            this.effect.apply(p, currentPlayer);
        })

    }

    endCast(players: Array<Player>, currentPlayer: Player, game: Game) {
        this._playersHit.forEach((p) => {
            this.effect.remove(p, currentPlayer);
        })
    }


}