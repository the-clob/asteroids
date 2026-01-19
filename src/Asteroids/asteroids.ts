// import type { Velocity, Position } from "./types";
import Input from "./input";
import Entity from "./entity";
import Player from "./player";


// Game settings
const MAX_FPS: number = 60;
const TIMESTEP: number = 1000 / MAX_FPS;

// Physics
const FRICTION: number = 0.98;
const PLAYER_ACCELERATION: number = 0.005;
const ROTATION_SPEED: number = 0.004;


export default class Asteroids {
    ctx: CanvasRenderingContext2D;

    // Game loop time variables
    delta: number = 0;
    lastFrameTimeMs: DOMHighResTimeStamp = 0;

    input: Input;
    player: Player;
    entities: Entity[] = [];

    constructor({ ctx }: { ctx: CanvasRenderingContext2D }) {
        this.ctx = ctx;
        this.input = new Input();
        this.player = new Player({
            position: { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
            velocity: { x: 0, y: 0 },
            rotation: 0,
            color: "white",
        });
    }

    update() {
        if (this.input.keys.w) {
            this.player.velocity.x += Math.cos(this.player.rotation) * PLAYER_ACCELERATION * this.delta;
            this.player.velocity.y += Math.sin(this.player.rotation) * PLAYER_ACCELERATION * this.delta;
        }
        else {
            this.player.velocity.x *= FRICTION;
            this.player.velocity.y *= FRICTION;
        }

        if (this.input.keys.a) {
            this.player.rotation -= ROTATION_SPEED * this.delta;
        }

        if (this.input.keys.d) {
            this.player.rotation += ROTATION_SPEED * this.delta;
        }

        this.player.update();
    }

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.player.draw(this.ctx);
    }

    gameLoop = (timestamp: DOMHighResTimeStamp) => {
        if (timestamp < this.lastFrameTimeMs + TIMESTEP) {
            requestAnimationFrame(this.gameLoop);
            return;
        }
        this.delta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        while (this.delta >= TIMESTEP) {
            this.update();
            this.delta -= TIMESTEP;
        }

        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    init() {
        requestAnimationFrame(this.gameLoop);
    }
}
