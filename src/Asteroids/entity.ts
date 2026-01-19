import type { Position, Velocity } from "./types";


export default abstract class Entity {
    position: Position;
    velocity: Velocity;
    rotation: number;

    color: string;

    constructor({ position, velocity, rotation, color }: { position: Position, velocity: Velocity, rotation: number, color: string }) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.rotation = rotation;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract update(): void;
    
}
