import Effect from "./Effect";
import {Player} from "../../Player";

export enum HealType {
    heal,
    sustain
}

export class HealEffect extends Effect {
    healType: HealType;
    healValue: number;

    constructor(healType: HealType, healValue: number) {
        super();
        this.healType = healType;
        this.healValue = healValue;
    }

    apply(player: Player, currentPlayer: Player): void {
        switch (this.healType) {
            case HealType.heal:
                currentPlayer.heal(this.healValue);
                break;
            case HealType.sustain:
                //TODO implement sustain
                currentPlayer.heal(player.hp * (0.10))
                break;
        }
    }

    remove(player: Player, currentPlayer: Player): void {
        //nothing to do
    }

}