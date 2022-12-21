import Player from "../../Player";

export default abstract class Effect {
    abstract apply(player: Player, currentPlayer: Player): void;

    abstract remove(player: Player, currentPlayer: Player): void;
}