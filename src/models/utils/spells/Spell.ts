import Effect from "../effects/Effect";
import Shape from "../shapes/Shape";
import {SpellType} from "./SpellType";
import {SpellAction} from "./SpellAction";
import Player from "../../Player";
import Game from "../../Game";

export default class Spell {
    public name: string;
    public description: string;
    public cooldown: number;
    public damage: number;
    public shape: Shape;
    public effect: Effect;
    public type: SpellType;
    public action: SpellAction;

    private _currentPlayer: Player;
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
        currentPlayer: Player
    ) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.damage = damage;
        this.shape = shape;
        this.effect = effect;
        this.type = type;
        this.action = action;

        this._currentPlayer = currentPlayer;
    }

    public cast(players: Array<Player>, currentPlayer: Player, game: Game) {
        this._playersHit = players.filter((p) => {
            return this.shape.isInside(p.coordinate, currentPlayer.coordinate, currentPlayer.rotation);
        })

        this._playersHit.forEach((p) => {
            p.takeDamage(this.damage);
            this.effect.apply(p, currentPlayer);
        })
    }

    public endCast(players: Array<Player>, currentPlayer: Player, game: Game) {
        this._playersHit.forEach((p) => {
            this.effect.remove(p, currentPlayer);
        })
    }


}