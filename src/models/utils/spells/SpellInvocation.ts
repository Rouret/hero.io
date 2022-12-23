import Spell from "./Spell";
import Coordinate from "../Coordinate";

export default class SpellInvocation {
    public spell: Spell;
    public coordinate: Coordinate;

    public constructor(spell: Spell, coordinate: Coordinate) {
        this.spell = spell;
        this.coordinate = coordinate;
    }

}