import Effect from "./Effect";
import {Player} from "../../Player";

export default class BlockEffect extends Effect {
    apply(player: Player, currentPlayer: Player): void {
        if (currentPlayer.currentEffect != null) return
        currentPlayer.currentEffect = this;
    }

    remove(player: Player, currentPlayer: Player): void {
        currentPlayer.currentEffect = null;
    }
}