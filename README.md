# Asteroids

A semi-faithful recreation of the classic 1979 Atari arcade game, built with TypeScript and Vue.js using the HTML5 Canvas API.

## Tech Stack

- **TypeScript** — statically typed throughout
- **Vue.js** — app shell and canvas mounting
- **Vite** — dev server and build tooling
- **HTML5 Canvas API** — all game rendering

## Features

- Player ship with rotation, thrust, and inertia
- Asteroids split into smaller pieces when hit
- Screen wrapping for player and asteroids
- Circle collision detection (squared distance optimization)
- Simple effects engine (asteroids explode, player ship breaks into lines)
- Scoring based on asteroid size (large: 20pts, medium: 50pts, small: 100pts)
- Game state machine (playing, player dead, round clear, game over)
- Lives system with respawn and invincibility window
- Progressive round difficulty (more asteroids each round)
- Cool thruster flame animation

## Controls

| Key | Action |
|-----|--------|
| `W` | Thrust forward |
| `A` | Rotate left |
| `D` | Rotate right |
| `Space` | Fire |

## Project Structure

```
src/
├── entities/
│   ├── entity.ts        # Abstract base class (position, velocity, collision)
│   ├── player.ts        # Player ship, movement, bullet spawning
│   ├── asteroid.ts      # Asteroid entity, random shape generation
│   └── bullet.ts        # Bullet entity with lifetime expiry
├── effects/
│   ├── effect.ts        # Abstract base class (lifetime, progress)
│   ├── explosion.ts     # Particle burst effect on asteroid death
│   └── player-death.ts  # Floating line fragments on player death
├── game.ts              # Main game class, loop, state machine
├── input.ts             # Keyboard input handler
├── constants.ts         # All tunable game values
└── types.ts             # Shared types and enums
```

## Getting Started

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Game Architecture

The game runs on a fixed timestep loop with delta time accumulation, keeping physics framerate-independent. Entities share a common base class providing position, velocity, rotation, scale, and circle collision detection. Effects use a normalized `progress` value (0–1) derived from elapsed lifetime, driving both movement easing and opacity fade.

## Planned Features

- Alien saucers
- High score table
- Gain a life every 10,000 points
- Sound effects
