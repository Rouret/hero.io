import Effect from "../effects/Effect";
import {SpellType} from "../spells/SpellType";
import {SpellAction} from "../spells/SpellAction";

export default interface Special {
    name: string;
    description: string;
    cooldown: number;
    range: number;
    effect: Effect;
    type: SpellType;
    action: SpellAction;
}