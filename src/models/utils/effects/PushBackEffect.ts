import {Effect, EffectTarget, EffectType} from "./Effect";
import {Player} from "../../Player";

export enum PushBackType {
    pushBack1 = 5,
    pushBack2 = 10,
    pushBack3 = 15
}

export class PushBackEffect extends Effect {

    pushBackType: PushBackType;

    constructor(pushBackType: PushBackType) {
        super(EffectTarget.onPlayer, EffectType.atTheEndOfCast);
        this.pushBackType = pushBackType;
    }

    apply(player: Player, currentPlayer: Player): void {
        const angle = Math.atan2(player.coordinate.y - currentPlayer.coordinate.y, player.coordinate.x - currentPlayer.coordinate.x);
        player.coordinate.x += Math.cos(angle) * this.pushBackType;
        player.coordinate.y += Math.sin(angle) * this.pushBackType;
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    remove(player: Player, currentPlayer: Player): void {
        // Nothing to do
    }

}