import Effect from "../effects/Effect";

export default interface Special {
    name: string;
    description: string;
    cooldown: number;
    range: number;
    effect: Effect;
}