import Spell from "./Spell";
import Coordinate from "../Coordinate";
import Player from "../../Player";

export default class SpellInvocation {
    public spell: Spell;
    public coordinate: Coordinate;
    public player: Player;

    public constructor(spell: Spell, coordinate: Coordinate, player: Player) {
        this.spell = spell;
        this.coordinate = coordinate;
        this.player = player;
    }

}