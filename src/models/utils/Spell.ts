import Effect from "./effects/Effect";
import Shape from "./shapes/Shape";

export default class Spell {
    public name: string;
    public description: string;
    public cooldown: number;
    public damage: number;
    public shape: Shape;
    public effect: Effect;

    public constructor(
        name: string,
        description: string,
        time: number,
        cooldown: number,
        damage: number,
        shape: Shape,
        effect: Effect
    ) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.damage = damage;
        this.shape = shape;
        this.effect = effect;
    }
}