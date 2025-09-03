
export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP';

export enum GameState {
  Ready,
  Playing,
  Paused,
  GameOver,
  Won,
}

export enum Tile {
  Empty,
  Wall,
  Pellet,
  PowerPellet,
  GhostHouse,
}

export interface Pacman {
  position: Position;
  direction: Direction;
  nextDirection: Direction;
}

export interface Ghost {
  id: string;
  position: Position;
  direction: Direction;
  isFrightened: boolean;
  frightenedTimer: number;
  startPosition: Position;
}
