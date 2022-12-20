import {BoostTypes} from "./BoostTypes";
import Coordinate from "./Coordinate";
import Dimension from "./Dimension";
import Game from "./Game";

export default class Player {
    id: string;
    name: string;
    coordinate: Coordinate;
    speed: number;
    initSpeed: number;
    score: number;
    size: number;
    rotation: number;
    clientDim: Dimension;
    effect: any;
    isMoving: boolean;

    constructor(id: string, window: Dimension, name: string, coordinate: Coordinate) {
        this.id = id;
        this.name = name;
        this.coordinate = coordinate;
        this.speed = 5;
        this.initSpeed = this.speed;
        this.score = 0;
        this.size = 50;
        this.rotation = 0;

        this.clientDim = new Dimension(window.width, window.height);
        this.effect = null;
        this.isMoving = false;
    }

    isCollidingWith(bullets) {
        for (const bullet of bullets) {
            if (
                bullet.player.id !== this.id &&
                this.coordinate.x >= bullet.current.x - bullet.size &&
                this.coordinate.x <= bullet.current.x + bullet.size &&
                this.coordinate.y >= bullet.current.y - bullet.size &&
                this.coordinate.y <= bullet.current.y + bullet.size
            ) {
                return bullet;
            }
        }
        return null;
    }

    isCollidingWithBoost(boosts) {
        for (const boost of boosts) {
            if (
                boost.id !== this.id &&
                this.coordinate.x >= boost.x - boost.size * 1.5 &&
                this.coordinate.x <= boost.x + boost.size * 1.5 &&
                this.coordinate.y >= boost.y - boost.size * 1.5 &&
                this.coordinate.y <= boost.y + boost.size * 1.5
            ) {
                return boost;
            }
        }
        return null;
    }

    move(rotation: number, game: Game) {
        this.rotation = rotation;

        const newPlayerCoordinate = new Coordinate(
            this.coordinate.x + Math.cos(rotation) * this.speed,
            this.coordinate.y - Math.sin(rotation) * this.speed
        );

        if (
            newPlayerCoordinate.x < 0 ||
            newPlayerCoordinate.x > game.worldDimension.width ||
            newPlayerCoordinate.y < 0 ||
            newPlayerCoordinate.y > game.worldDimension.height
        ) {
            return;
        }

        this.coordinate = newPlayerCoordinate;
    }

    setEffect(effect) {
        this.effect = effect.type;

        switch (effect.type) {
            case BoostTypes.SPEED: {
                this.speed += 1;
                break;
            }
            default:
                break;
        }
    }

    removeEffect() {
        switch (this.effect) {
            case BoostTypes.SPEED:
                this.speed = 3;
        }
        this.effect = null;
    }
}
