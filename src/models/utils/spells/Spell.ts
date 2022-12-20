import Effect from "../effects/Effect";
import Shape from "../shapes/Shape";
import {SpellType} from "./SpellType";
import {SpellAction} from "./SpellAction";

export default class Spell {
    public name: string;
    public description: string;
    public cooldown: number;
    public damage: number;
    public shape: Shape;
    public effect: Effect;
    public type: SpellType;
    public action: SpellAction;

    public constructor(
        name: string,
        description: string,
        time: number,
        cooldown: number,
        damage: number,
        shape: Shape,
        effect: Effect,
        type: SpellType,
        action: SpellAction
    ) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.damage = damage;
        this.shape = shape;
        this.effect = effect;
        this.type = type;
        this.action = action;
    }
}