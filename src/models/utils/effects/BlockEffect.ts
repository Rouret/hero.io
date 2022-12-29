import {Effect, EffectTarget, EffectType} from "./Effect";
import {Player} from "../../Player";

export default class BlockEffect extends Effect {

    constructor() {
        super(EffectTarget.onCurrentPlayer, EffectType.duringCast);
    }

    apply(player: Player, currentPlayer: Player): void {
        //Block take the avantage of the current effect
        currentPlayer.currentEffect = this;
    }

    remove(player: Player, currentPlayer: Player): void {
        currentPlayer.currentEffect = null;
    }
}