import Special from "./Special";
import Effect from "../effects/Effect";

export default class Dash implements Special {
    name: string;
    description: string;
    cooldown: number;
    range: number;
    effect: Effect;

    public constructor(
        name: string,
        description: string,
        cooldown: number,
        range: number,
        effect: Effect
    ) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.range = range;
        this.effect = effect;
    }
}