import type { Position, Velocity } from "../types";
import { PLAYER_SETTINGS } from "../contants.ts";
import Entity from "./entity.ts"


export default class Player extends Entity {
    lives: number = 3;

    constructor({ position, velocity, rotation, shape, color }: { position: Position, velocity: Velocity, rotation: number, 
                shape: [number, number][], color: string }) {
        super({ position, velocity, rotation, shape, color });
        this.rotation = 0;
    }

    update() {
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

        if (speed > PLAYER_SETTINGS.MAX_SPEED) {
            // Normalize
            if (speed > 0) {
                this.velocity.x /= speed;
                this.velocity.y /= speed;
            }

            this.velocity.x *= PLAYER_SETTINGS.MAX_SPEED;
            this.velocity.y *= PLAYER_SETTINGS.MAX_SPEED;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

