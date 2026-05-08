import type { Position, Boundaries, AsteroidSizes } from "./types";
import { GameState } from "./types";
import { GAME_SETTINGS, PLAYER_SETTINGS, ASTEROID_SETTINGS } from "./constants";
import Input from "./input";
import Player from "./entities/player";
import Asteroid from "./entities/asteroid";
import Bullet from "./entities/bullet";
import Effect from "./effects/effect";
import Explosion from "./effects/explosion";
import PlayerDeath from "./effects/player-death";


export default class Asteroids {
    private ctx: CanvasRenderingContext2D;
    private onGameOver: (score: number) => void;

    private input: Input;
    private boundaries: Boundaries;

    // Game loop time variables
    private accumulator: number = 0;
    private lastFrameTimeMs: DOMHighResTimeStamp = 0;
    private lastFrameDuration: number = 0;

    // Entities
    private player: Player;
    private asteroids: Asteroid[] = [];
    private bullets: Bullet[] = [];
    private effects: Effect[] = [];

    // Game state
    private debug: boolean = false;
    private state: GameState = GameState.PLAYING;
    private score: number = 0;
    private lives: number = GAME_SETTINGS.STARTING_LIVES;
    private round: number = 1;

    // Timers
    private deadTimer: number = 0;
    private roundClearTimer: number = 0;
    private invincibleTimer: number = 0;

    constructor({ ctx, onGameOver }: { ctx: CanvasRenderingContext2D, onGameOver: (score: number) => void }) {
        this.ctx = ctx;
        this.onGameOver = onGameOver;

        this.boundaries = this.calculateBoundaries();
        this.input = new Input();

        this.player = new Player({
            position: { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
            velocity: { x: 0, y: 0 },
            rotation: 0,
            shape: PLAYER_SETTINGS.SHAPE.map(path => path.map((point) => point as [number, number])),
            scale: 10,
            color: "white",
        });
        this.player.invincible = true;

        this.spawnAsteroids();
    }

    public init() {
        requestAnimationFrame(this.gameLoop);
    }

    private drawDebug() {
        const fps = Math.round(1000 / (this.lastFrameDuration || 1));
        const lines = [
            `FPS: ${fps}`,
            `# Asteroids: ${this.asteroids.length}`,
            `# Bullets: ${this.bullets.length}`,
            `# Effects: ${this.effects.length}`,
            `State: ${this.state}`,
            `Round: ${this.round}`,
            `Accumulator: ${this.accumulator.toFixed(2)}ms`,
            `Frame Time: ${this.lastFrameDuration.toFixed(2)}ms`,
        ];

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(10, 10, 160, lines.length * 18 + 10);

        this.ctx.fillStyle = "lime";
        this.ctx.font = "14pt monospace";

        lines.forEach((line, i) => { this.ctx.fillText(line, 16, 26 + i * 18); });
    }

    private handleInput(deltaTime: number) {
        // Only process input if the player is alive & game state is playing or round clear
        if (this.player.destroyed || (this.state !== GameState.PLAYING && this.state !== GameState.ROUND_CLEAR)) {
            return;
        }

        if (this.input.keys.w) {
            this.player.moveForward(deltaTime);
        }
        else {
            // Turn off thruster animation
            this.player.stopThrusting();
        }

        // Rotate left
        if (this.input.keys.a) {
            this.player.rotate(deltaTime, -1);
        }

        // Rotate right
        if (this.input.keys.d) {
            this.player.rotate(deltaTime, 1);
        }

        if (this.input.keys.space) {
            const bullet = this.player.spawnBullet();
            if (bullet) {
                this.bullets.push(bullet);
            }
        }
    }

    private handleCollisions() {
        // Check asteroid collisions
        for (const asteroid of this.asteroids) {
            if (!this.player.destroyed && !this.player.invincible && this.player.collidesWith(asteroid)) {
                this.player.destroyed = true;

                // Update game state for player death
                this.lives--;
                this.state = GameState.PLAYER_DEAD;
                this.deadTimer = 0;

                this.effects.push(new PlayerDeath({
                    position: { x: this.player.position.x, y: this.player.position.y }, 
                    playerScale: this.player.scale
                }));
            }
            // Bullet collisions here
            for (const bullet of this.bullets) {
                if (bullet.destroyed) continue;
                if (bullet.collidesWith(asteroid)) {
                    bullet.destroyed = true;

                    this.score += ASTEROID_SETTINGS.SCORE[asteroid.size];

                    this.effects.push(new Explosion({
                        position: { x: asteroid.position.x, y: asteroid.position.y }
                    }));

                    this.splitAsteroid(asteroid);
                    break;
                }
            }
        }
    }

    private randomSpawnPosition() {
        const safeRadiusSq = GAME_SETTINGS.SPAWN_SAFE_RADIUS ** 2;
        let position: Position;
        let dx: number;
        let dy: number;

        do {
            position = {
                x: Math.random() * this.ctx.canvas.width,
                y: Math.random() * this.ctx.canvas.height
            };

            dx = position.x - this.player.position.x;
            dy = position.y - this.player.position.y;
        } while (((dx ** 2) + (dy ** 2)) < safeRadiusSq);

        return position
    }

    private spawnAsteroids() {
        // Number of asteroids to spawn
        const count = ASTEROID_SETTINGS.STARTING_COUNT + (this.round - 1) * ASTEROID_SETTINGS.COUNT_INCREMENT;
        for (let i = 0; i < count; i++) {
            const position = this.randomSpawnPosition();
            this.asteroids.push(new Asteroid({
                position,
                velocity: {
                    x: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPAWN_SPEED, 
                    y: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPAWN_SPEED 
                }, 
                rotation: Math.random() * (Math.PI * 2),
                size: "large", 
                color: "white"
            }));
        }
    }

    private respawnPlayer() {
        // Reset position & velocity
        this.player.position = {
            x: this.ctx.canvas.width / 2,
            y: this.ctx.canvas.height / 2
        };
        this.player.velocity = { x: 0, y: 0 };

        // Respawn player as invincible
        this.player.invincible = true;
        this.player.destroyed = false;
    }

    private handlePlayerDead(deltaTime: number) {
        this.deadTimer += deltaTime;
        if (this.deadTimer >= GAME_SETTINGS.DEAD_DURATION) {
            if (this.lives > 0) {
                this.respawnPlayer();
                this.state = GameState.PLAYING;
            }
            else {
                this.state = GameState.GAME_OVER;
                this.input.destroy();
                this.onGameOver(this.score);
            }
        }
    }

    private handleRoundCleared(deltaTime: number) {
        this.roundClearTimer += deltaTime;

        if (this.roundClearTimer >= GAME_SETTINGS.ROUND_CLEAR_DURATION) {
            this.roundClearTimer = 0;
            this.round++;
            this.spawnAsteroids();
            this.state = GameState.PLAYING;
        }
    }

    private update(deltaTime: number) {
        if (!this.player.destroyed) {
            this.player.handleBoundaries(this.boundaries);
            this.player.update(deltaTime);
        }
        if (this.player.invincible) {
            if (this.invincibleTimer >= PLAYER_SETTINGS.INVINCIBLE_DURATION) {
                this.player.invincible = false;
                this.invincibleTimer = 0;
            }
            else {
                this.invincibleTimer += deltaTime;
            }
        }

        this.asteroids.forEach(a => {
            a.handleBoundaries(this.boundaries);
            a.update(deltaTime);
        });

        // Bullets and effects don't wrap the screen
        this.bullets.forEach(b => b.update(deltaTime));
        this.effects.forEach(e => e.update(deltaTime));

        this.handleCollisions();

        // Destroy Entities
        this.cleanUpAllDestroyed();

        if (this.state === GameState.PLAYING && this.asteroids.length === 0) {
            this.state = GameState.ROUND_CLEAR;
        }
        else if (this.state === GameState.PLAYER_DEAD) {
            this.handlePlayerDead(deltaTime);
        }
        else if (this.state === GameState.ROUND_CLEAR) {
            this.handleRoundCleared(deltaTime);
        }
    }

    private drawHUD() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "24px monospace";
        this.ctx.fillText(this.score.toString(), GAME_SETTINGS.HUD_SCORE_START_X, GAME_SETTINGS.HUD_SCORE_START_Y);
    }

    private drawLives() {
        const shipShape = PLAYER_SETTINGS.SHAPE;
        const scale = 4;
        const spacing = 35;

        for (let i = 0; i < this.lives; i++) {
            const x = GAME_SETTINGS.HUD_LIVES_START_X + i * spacing;
            this.ctx.save();
            this.ctx.translate(x, GAME_SETTINGS.HUD_LIVES_START_Y);
            this.ctx.rotate(-Math.PI / 2); // Point the ship upward
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1.5;

            for (const path of shipShape) {
                this.ctx.beginPath();
                path.forEach(([px, py], index) => {
                    const sx = px * scale;
                    const sy = py * scale;
                    index === 0 ? this.ctx.moveTo(sx, sy) : this.ctx.lineTo(sx, sy); 
                });
                this.ctx.closePath();
                this.ctx.stroke();
            }

            this.ctx.restore();
        }
    }

    private draw() {
        // Reset screen
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw the player, if they are invincible only draw them 
        if (!this.player.destroyed && (!this.player.invincible || 
                                        Math.floor(this.invincibleTimer / PLAYER_SETTINGS.INVINCIBLE_FLASH_DURATION) % 2 === 0)) {
            this.player.draw(this.ctx);
        }

        this.asteroids.forEach(a => a.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.effects.forEach(e => e.draw(this.ctx));

        if (this.debug) {
            this.drawDebug();
        }

        if (this.state !== GameState.GAME_OVER) {
            this.drawHUD();
            this.drawLives();
        }
    }

    // Arrow function preserves 'this' context for requestAnimationFrame callback
    private gameLoop = (timestamp: DOMHighResTimeStamp) => {
        // Leaving this commented out, I like how the asteroids still fly on the game over screen
        // if (this.state === GameState.GAME_OVER) return;

        const frameTime = timestamp - this.lastFrameTimeMs;

        this.lastFrameDuration = frameTime;
        this.lastFrameTimeMs = timestamp;
        
        // Accumulate time that has passed, cap it to avoid a death spiral
        this.accumulator += Math.min(frameTime, GAME_SETTINGS.MAX_DELTATIME);

        // Fixed timestep update
        while (this.accumulator >= GAME_SETTINGS.TIMESTEP) {
            this.handleInput(GAME_SETTINGS.TIMESTEP);
            this.update(GAME_SETTINGS.TIMESTEP);
            this.accumulator -= GAME_SETTINGS.TIMESTEP;
        }

        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    private calculateBoundaries(buffer: number = GAME_SETTINGS.BOUNDARY_BUFFER): Boundaries {
        return {
            MIN_X: -buffer, 
            MIN_Y: -buffer, 
            MAX_X: this.ctx.canvas.width + buffer, 
            MAX_Y: this.ctx.canvas.height + buffer
        };
    }

    private cleanUpAllDestroyed() {
        this.asteroids = this.asteroids.filter(a => !a.destroyed);
        this.bullets = this.bullets.filter(b => !b.destroyed && !b.isExpired);
        this.effects = this.effects.filter(e => !e.isExpired);
    }

    public splitAsteroid(asteroid: Asteroid) {
        const newAsteroidSize: AsteroidSizes | null = asteroid.size === "large" ? "medium" 
                                                    : asteroid.size === "medium" ? "small" 
                                                    : null;

        if (newAsteroidSize) {
            for (let i = 0; i < 2; i++) {
                this.asteroids.push(new Asteroid({
                    position: { x: asteroid.position.x, y: asteroid.position.y }, 
                    velocity: {
                        x: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPLIT_SPEED, 
                        y: (Math.random() - 0.5) * ASTEROID_SETTINGS.SPLIT_SPEED
                    }, 
                    rotation: Math.random() * Math.PI * 2, 
                    size: newAsteroidSize, 
                    color: "white"
                }));
            }
        }

        asteroid.destroyed = true;
    }
}
