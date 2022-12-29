import {SpellType} from "../spells/SpellType";
import {SpellAction} from "../spells/SpellAction";
import {Effect} from "../effects/Effect";

export default class Special {
    public name: string;
    public description: string;
    public cooldown: number;
    public range: number;
    public effect: Effect;
    public type: SpellType;
    public action: SpellAction;
    public onCooldown: boolean;
    public onCast: boolean;

    public constructor(name: string, description: string, cooldown: number, range: number, effect: Effect, type: SpellType, action: SpellAction) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.range = range;
        this.effect = effect;
        this.type = type;
        this.action = action;
    }

}