import type { Position, Velocity } from "../types";
import Entity from "./entity.ts"


const MAX_SPEED: number = 20;


export default class Player extends Entity {
    lives: number = 3;

    constructor({ position, velocity, rotation, color }: { position: Position, velocity: Velocity, rotation: number, color: string }) {
        super({ position, velocity, rotation, color });
        this.rotation = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (ctx) {
            // Circle in middle of player
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 3, 0, Math.PI * 2, false);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();

            // Save original context before rotating
            ctx.save();

            // Rotate player
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.translate(-this.position.x, -this.position.y);

            // Draw player triangle
            ctx.beginPath();
            ctx.moveTo(this.position.x + 20, this.position.y);
            ctx.lineTo(this.position.x - 15, this.position.y - 15);
            ctx.lineTo(this.position.x - 15, this.position.y + 15);
            ctx.closePath();

            // Color lines
            ctx.strokeStyle = this.color;
            ctx.stroke();

            // Restore original context
            ctx.restore();
        }
    }

    update() {
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

        if (speed > MAX_SPEED) {
            // Normalize
            if (speed > 0) {
                this.velocity.x /= speed;
                this.velocity.y /= speed;
            }

            this.velocity.x *= MAX_SPEED;
            this.velocity.y *= MAX_SPEED;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

