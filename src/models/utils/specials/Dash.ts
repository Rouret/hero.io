import Special from "./Special";
import Effect from "../effects/Effect";
import {SpellType} from "../spells/SpellType";
import {SpellAction} from "../spells/SpellAction";

export default class Dash implements Special {
    name: string;
    description: string;
    cooldown: number;
    range: number;
    effect: Effect;
    type: SpellType;
    action: SpellAction;

    public constructor(
        name: string,
        description: string,
        cooldown: number,
        range: number,
        effect: Effect,
        type: SpellType,
        action: SpellAction
    ) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.range = range;
        this.effect = effect;
        this.type = type;
        this.action = action;
    }
}