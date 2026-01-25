export const GAME_SETTINGS = {
    MAX_FPS: 60,
    TIMESTEP: 1000 / 60,

    // Physics
    FRICTION: 0.98,
} as const;

export const PLAYER_SETTINGS = {
    ACCELERATION: 0.005,
    ROTATION_SPEED: 0.004,
    MAX_SPEED: 20,
    SHAPE: [[20, 0], [-15, -15], [-15, 15]],
} as const;

export const WORLD_SETTINGS = {
    BOUNDARIES: {
        MIN_X: 0,
        MIN_Y: 0,
        MAX_X: 500,
        MAX_Y: 500,
    }
} as const;

