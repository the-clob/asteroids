export const GAME_SETTINGS = {
    TIMESTEP: 1000 / 60,
    MAX_DELTATIME: 100,

    // Physics
    FRICTION: 0.9994,
    RADIUS_MODIFIER: 0.8,
    
    // Non-visible part of the world on the edges
    BOUNDARY_BUFFER: 100, 

    // Game state
    STARTING_LIVES: 3,
    DEAD_DURATION: 3000, 
    ROUND_CLEAR_DURATION: 4000, 
    SPAWN_SAFE_RADIUS: 150,

    // HUD
    HUD_SCORE_START_X: 20,
    HUD_SCORE_START_Y: 40,
    HUD_LIVES_START_X: 30,
    HUD_LIVES_START_Y: 80,
} as const;

export const PLAYER_SETTINGS = {
    ACCELERATION: 0.0003, 
    ROTATION_SPEED: 0.004, 
    MAX_SPEED: 0.4, 
    FIRE_RATE: 500, // Milliseconds 
    INVINCIBLE_DURATION: 5000,
    INVINCIBLE_FLASH_DURATION: 250,
    THRUSTER_FLASH_DURATION: 100,
    SHAPE: [
        // Main triangle
        [
            [5, 0],
            [-4, 3],
            [-3, 1],
            [-3, -1],
            [-4, -3]
        ]
    ],
    THRUST_PATH: [
        [-3, 1],
        [-5, 0],
        [-3, -1]
    ],
} as const;

export const ASTEROID_SETTINGS = {
    MAX_SPEED: 50,
    SPLIT_SPEED: 0.15, 
    SPAWN_SPEED: 0.10, 
    SIZE_TO_SCALE: {
        "small": 4,
        "medium": 8, 
        "large": 12
    }, 
    SCORE: {
        "small": 100, 
        "medium": 50, 
        "large": 20
    },  
    STARTING_COUNT: 4, 
    COUNT_INCREMENT: 2,
    POSSIBLE_SHAPES: [
        // 0
        [
            [
                [5, 0],
                [4, -4],
                [1, -5],
                [-2, -4],
                [-4, -4],
                [-5, -1],
                [-3, -1],
                [-5, 2],
                [-3, 3],
                [-2, 5],
                [0, 5],
                [3, 4],
                [4, 3],
                [4, 1]
            ]
        ],
        // 1 
        [
            [
                [5, 0],
                [4, -3],
                [3, -4],
                [0, -6],
                [-2, -4],
                [-4, -4],
                [-5, -1],
                [-4, 2],
                [-4, 3],
                [-3, 3],
                [-1, 5],
                [4, 3],
                [4, 1]
            ]
        ],
        // 2 
        [
            [
                [5, -1],
                [4, -3],
                [3, -5],
                [1, -4],
                [-2, -5],
                [-2, -3],
                [-4, -4],
                [-4, -2],
                [-5, 0],
                [-5, 3],
                [-3, 4],
                [-2, 3],
                [0, 5],
                [4, 3],
                [3, 2],
                [3, 1]
            ]
        ],
        // 3 
        [
            [
                [3, -2],
                [3, -4],
                [0, -5],
                [-2, -4],
                [-4, -4],
                [-4, -1],
                [-5, 1],
                [-3, 4],
                [-1, 5],
                [2, 5],
                [1, 3],
                [3, 4],
                [5, 1]
            ]
        ]
    ]
} as const;

export const BULLET_SETTINGS = {
    RADIUS: 3, 
    MAX_DISTANCE: 1000, 
    SPEED: 0.35
} as const;
