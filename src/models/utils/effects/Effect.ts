import {Player} from "../../Player";


export enum EffectTarget {
    onCurrentPlayer,
    onPlayer,
}

export enum EffectType {
    atTheStartOfCast,
    atTheEndOfCast,
    duringCast,
}

export abstract class Effect {

    public effectTarget: EffectTarget;
    public effectType: EffectType;

    protected constructor(effectTarget: EffectTarget, effectType: EffectType) {
        this.effectTarget = effectTarget;
        this.effectType = effectType;
    }

    abstract apply(player: Player, currentPlayer: Player): void;

    abstract remove(player: Player, currentPlayer: Player): void;
}