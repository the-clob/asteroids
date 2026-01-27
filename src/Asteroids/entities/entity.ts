import type { Position, Velocity } from "../types";
import { GAME_SETTINGS } from "../constants";


export default abstract class Entity {
    position: Position;
    velocity: Velocity;
    rotation: number;

    shape: [number, number][];
    color: string;

    constructor({ position, velocity, rotation, shape, color }: { position: Position, velocity: Velocity, 
                rotation: number, shape: [number, number][], color: string }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
        this.shape = shape;
        this.color = color;
    }

    handleBoundaries(): void {
        if (this.position.x > GAME_SETTINGS.WORLD_BOUNDARIES.MAX_X) {
            this.position.x = GAME_SETTINGS.WORLD_BOUNDARIES.MIN_X;
        }
        else if (this.position.x < GAME_SETTINGS.WORLD_BOUNDARIES.MIN_X) {
            this.position.x = GAME_SETTINGS.WORLD_BOUNDARIES.MAX_X;
        }

        if (this.position.y > GAME_SETTINGS.WORLD_BOUNDARIES.MAX_Y) {
            this.position.y = GAME_SETTINGS.WORLD_BOUNDARIES.MIN_Y;
        }
        else if (this.position.y < GAME_SETTINGS.WORLD_BOUNDARIES.MIN_Y) {
            this.position.y = GAME_SETTINGS.WORLD_BOUNDARIES.MAX_Y;
        }
    };

    draw(ctx: CanvasRenderingContext2D): void {
        if (!ctx || this.shape.length === 0 || !this.shape[0]) return; 

        // Save original context before rotating
        ctx.save();

        // Rotate
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);

        // Draw
        ctx.beginPath();

        const [startX, startY] = this.shape[0];
        ctx.moveTo(this.position.x + startX, this.position.y + startY);

        // Connect shape points
        for (const [x, y] of this.shape.slice(1)) {
            ctx.lineTo(this.position.x + x, this.position.y + y);
        }

        ctx.closePath();

        // Color lines
        ctx.strokeStyle = this.color;
        ctx.stroke();

        // Restore original context
        ctx.restore();

    };

    abstract update(): void;
}
