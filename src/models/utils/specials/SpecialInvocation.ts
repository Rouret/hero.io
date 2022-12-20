import Special from "./Special";
import Coordinate from "../Coordinate";
import Player from "../../Player";

export default class SpecialInvocation {
    public special: Special;
    public coordinate: Coordinate;
    public player: Player;

    public constructor(special: Special, coordinate: Coordinate, player: Player) {
        this.special = special;
        this.coordinate = coordinate;
        this.player = player;
    }

}