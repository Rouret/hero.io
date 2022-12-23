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
    public onCooldown: boolean;
    public onCast: boolean;
    public cooldownTime: number;

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

        this.cooldownTime = 0;
        this.onCooldown = false;
        this.onCast = false;

    }

    update() {
        if (this.onCooldown) {
            this.cooldownTime += 1;
            if (this.cooldownTime >= this.cooldown) {
                this.cooldownTime = 0;
                this.onCooldown = false;
            }
            
        }
    }

    cast(game: Game, currentPlayer: Player, spellCoordinate: Coordinate) {
        if (this.onCooldown || this.onCast) return;
        this.onCast = true;
        //get players in shape
        this._playersHit = game.players.filter((p) => {
            if (p.id === currentPlayer.id) return false;
            if (this.type === SpellType.onCharacter) {
                return this.shape.isInside(p.coordinate, currentPlayer.coordinate, currentPlayer.rotation);
            } else {
                return this.shape.isInside(p.coordinate, spellCoordinate, currentPlayer.rotation);
            }
        })

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

        this.endCast(this._playersHit, currentPlayer, game);

    }

    endCast(players: Array<Player>, currentPlayer: Player, game: Game) {
        this._playersHit.forEach((p) => {
            this.effect.remove(p, currentPlayer);
        })

        this.onCooldown = true;
        this.onCast = false;
        this._playersHit = [];
    }


}