import { GAME_SETTINGS } from "./constants";
import { PLAYER_SETTINGS } from "./constants";

import Input from "./input";
import Entity from "./entities/entity";
import Player from "./entities/player";


export default class Asteroids {
    ctx: CanvasRenderingContext2D;

    // Game loop time variables
    deltaTime: number = 0;
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
            shape: PLAYER_SETTINGS.SHAPE.map(point => [...point]),
            color: "white",
        });

        this.entities.push(this.player);
    }

    update() {
        // Handle input
        if (this.input.keys.w) {
            this.player.velocity.x += Math.cos(this.player.rotation) * PLAYER_SETTINGS.ACCELERATION * this.deltaTime;
            this.player.velocity.y += Math.sin(this.player.rotation) * PLAYER_SETTINGS.ACCELERATION * this.deltaTime;
        }
        if (this.input.keys.a) {
            this.player.rotation -= PLAYER_SETTINGS.ROTATION_SPEED * this.deltaTime;
        }

        if (this.input.keys.d) {
            this.player.rotation += PLAYER_SETTINGS.ROTATION_SPEED * this.deltaTime;
        }

        // Update all entities
        this.entities.forEach(entity => {
            entity.update();
        });
    }

    draw() {
        // Reset screen
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw all entities
        this.entities.forEach(entity => {
            entity.draw(this.ctx);
        });
    }

    gameLoop = (timestamp: DOMHighResTimeStamp) => {
        // Delta time
        if (timestamp < this.lastFrameTimeMs + (1000 / GAME_SETTINGS.MAX_FPS)) {
            requestAnimationFrame(this.gameLoop);
            return;
        }
        this.deltaTime += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        while (this.deltaTime >= GAME_SETTINGS.TIMESTEP) {
            this.update();
            this.deltaTime -= GAME_SETTINGS.TIMESTEP;
        }

        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    init() {
        requestAnimationFrame(this.gameLoop);
    }
}
