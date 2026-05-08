import type { Position, Velocity, Shape } from "../types";
import { PLAYER_SETTINGS, GAME_SETTINGS, BULLET_SETTINGS } from "../constants";
import Entity from "./entity"
import Bullet from "./bullet"


export default class Player extends Entity {
    public invincible: boolean = false;

    private thrusting: boolean = false;
    private thrusterTimer: number = 0;
    private timeSinceLastShot: number = 0;

    constructor({ position, velocity, rotation, shape, scale, color }: 
                { position: Position, velocity: Velocity, rotation: number, shape: Shape, scale: number, color: string }) 
    {
        super({ position, velocity, rotation, shape, scale, color });
        this.rotation = 0;
    }

    public moveForward(deltaTime: number) {
        this.velocity.x += Math.cos(this.rotation) * PLAYER_SETTINGS.ACCELERATION * deltaTime;
        this.velocity.y += Math.sin(this.rotation) * PLAYER_SETTINGS.ACCELERATION * deltaTime;

        this.thrusting = true;
    }

    public stopThrusting() {
        this.thrusting = false;
        this.toggleThrusterAnimation(false);
    }

    public rotate(deltaTime: number, direction: 1 | -1) {
        this.rotation += PLAYER_SETTINGS.ROTATION_SPEED * deltaTime * direction;
    }

    public update(deltaTime: number) {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);

        // Cap speed
        if (speed > PLAYER_SETTINGS.MAX_SPEED) {
            this.velocity.x = (this.velocity.x / speed) * PLAYER_SETTINGS.MAX_SPEED;
            this.velocity.y = (this.velocity.y / speed) * PLAYER_SETTINGS.MAX_SPEED;
        }

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.velocity.x *= Math.pow(GAME_SETTINGS.FRICTION, deltaTime);
        this.velocity.y *= Math.pow(GAME_SETTINGS.FRICTION, deltaTime);

        this.timeSinceLastShot += deltaTime;

        // Make the thruster animation flash
        this.toggleThrusterAnimation(false);
        if (this.thrusting) {
            this.thrusterTimer += deltaTime;
            if (this.thrusterTimer >= PLAYER_SETTINGS.THRUSTER_FLASH_DURATION) {
                this.thrusterTimer = 0;
                this.toggleThrusterAnimation(true);
            }
        }
    }

    public spawnBullet(): Bullet | null {
        // Fire rate limiting
        if (this.timeSinceLastShot < PLAYER_SETTINGS.FIRE_RATE) {
            return null;
        }
        this.timeSinceLastShot = 0;

        // 5 is the x coord of the "nose" of the triangle
        const noseDistance = 5 * this.scale;
        return new Bullet({
            position: {
                x: this.position.x + Math.cos(this.rotation) * noseDistance,
                y: this.position.y + Math.sin(this.rotation) * noseDistance 
            },
            velocity: {
                x: Math.cos(this.rotation) * BULLET_SETTINGS.SPEED, 
                y: Math.sin(this.rotation) * BULLET_SETTINGS.SPEED
            },
            rotation: this.rotation, 
            scale: 1, 
            color: "white"
        });
    }

    private toggleThrusterAnimation(state: boolean) {
        if (state && this.shape.length === 1) {
            this.shape.push(PLAYER_SETTINGS.THRUST_PATH.map(point => [...point]));
        }
        else if (!state && this.shape.length > 1) {
            this.shape.pop();
        }
    }
}

