import {ProfessionType} from "../Player";
import Spell from "./spells/Spell";
import Special from "./specials/Special";

export default class SpellProfession {
    professionType: ProfessionType;
    spells: Array<Spell> = [];
    special: Special

    constructor(professionType: ProfessionType, spells: Array<Spell>, special: Special) {
        this.professionType = professionType;
        this.spells = spells;
        this.special = special;
    }

    get(spellId: string): Spell {
        return this.spells.find(spell => spell.id === spellId);
    }


}