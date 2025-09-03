
import { useState, useEffect, useCallback } from 'react';
import { GameState, Position, Direction, Pacman, Ghost, Tile } from '../types';
import { 
  BOARD_LAYOUT,
  PACMAN_START_POS, 
  GHOSTS_CONFIG, 
  LIVES_COUNT, 
  GAME_SPEED_MS,
  FRIGHTENED_DURATION_MS
} from '../constants';

const deepCloneBoard = () => BOARD_LAYOUT.map(row => [...row]);

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Ready);
  const [board, setBoard] = useState<Tile[][]>(deepCloneBoard);
  const [pacman, setPacman] = useState<Pacman>({ position: PACMAN_START_POS, direction: 'STOP', nextDirection: 'STOP' });
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(LIVES_COUNT);
  const [pelletCount, setPelletCount] = useState<number>(0);

  const resetPositions = useCallback(() => {
    setPacman({ position: PACMAN_START_POS, direction: 'STOP', nextDirection: 'STOP' });
    setGhosts(GHOSTS_CONFIG.map(config => ({
      ...config,
      position: { ...config.start },
      startPosition: { ...config.start },
      direction: 'STOP',
      isFrightened: false,
      frightenedTimer: 0,
    })));
  }, []);

  const initializeGame = useCallback(() => {
    const newBoard = deepCloneBoard();
    setBoard(newBoard);
    setScore(0);
    setLives(LIVES_COUNT);
    setPelletCount(newBoard.flat().filter(tile => tile === Tile.Pellet || tile === Tile.PowerPellet).length);
    resetPositions();
  }, [resetPositions]);

  const startGame = () => {
    initializeGame();
    setGameState(GameState.Playing);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    let nextDir: Direction = 'STOP';
    switch (e.key) {
      case 'ArrowUp': nextDir = 'UP'; break;
      case 'ArrowDown': nextDir = 'DOWN'; break;
      case 'ArrowLeft': nextDir = 'LEFT'; break;
      case 'ArrowRight': nextDir = 'RIGHT'; break;
      default: return;
    }
    setPacman(p => ({ ...p, nextDirection: nextDir }));
  }, []);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleKeyDown]);
  
  const isWall = (pos: Position) => {
    // Tunnel logic
    if (pos.x < 0 || pos.x >= board[0].length) return false;
    return board[pos.y][pos.x] === Tile.Wall;
  };
  
  const getNextPosition = (position: Position, direction: Direction) => {
    const nextPos = { ...position };
    switch (direction) {
      case 'UP': nextPos.y--; break;
      case 'DOWN': nextPos.y++; break;
      case 'LEFT': nextPos.x--; break;
      case 'RIGHT': nextPos.x++; break;
    }
    // Handle tunnel
    if (nextPos.x < 0) nextPos.x = board[0].length - 1;
    if (nextPos.x >= board[0].length) nextPos.x = 0;
    return nextPos;
  };

  const gameLoop = useCallback(() => {
    if (gameState !== GameState.Playing) return;

    // --- Pac-Man Movement ---
    setPacman(p => {
      let currentDirection = p.direction;
      let nextPosition = getNextPosition(p.position, p.nextDirection);
      if (!isWall(nextPosition)) {
        currentDirection = p.nextDirection;
      } else {
        nextPosition = getNextPosition(p.position, p.direction);
        if (isWall(nextPosition)) {
          currentDirection = 'STOP';
        }
      }
      
      const finalPosition = currentDirection !== 'STOP' ? getNextPosition(p.position, currentDirection) : p.position;

      // --- Pellet Collision ---
      const tileAtPos = board[finalPosition.y][finalPosition.x];
      if (tileAtPos === Tile.Pellet || tileAtPos === Tile.PowerPellet) {
        setBoard(b => {
          const newB = [...b];
          newB[finalPosition.y] = [...newB[finalPosition.y]];
          newB[finalPosition.y][finalPosition.x] = Tile.Empty;
          return newB;
        });
        setScore(s => s + (tileAtPos === Tile.Pellet ? 10 : 50));
        setPelletCount(pc => pc - 1);
        if (tileAtPos === Tile.PowerPellet) {
           setGhosts(gs => gs.map(g => ({ ...g, isFrightened: true, frightenedTimer: FRIGHTENED_DURATION_MS })));
        }
      }

      return { ...p, position: finalPosition, direction: currentDirection };
    });

    // --- Ghost Movement & State ---
    setGhosts(ghosts => ghosts.map(ghost => {
        let newGhost = { ...ghost };
        if (newGhost.isFrightened) {
            newGhost.frightenedTimer -= GAME_SPEED_MS;
            if (newGhost.frightenedTimer <= 0) {
                newGhost.isFrightened = false;
            }
        }
        
        const possibleDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const validMoves = possibleDirections.filter(dir => {
          // Prevent ghosts from reversing direction unless at a dead end
          if (dir === 'UP' && ghost.direction === 'DOWN') return false;
          if (dir === 'DOWN' && ghost.direction === 'UP') return false;
          if (dir === 'LEFT' && ghost.direction === 'RIGHT') return false;
          if (dir === 'RIGHT' && ghost.direction === 'LEFT') return false;
          
          const nextPos = getNextPosition(ghost.position, dir);
          return !isWall(nextPos) && board[nextPos.y][nextPos.x] !== Tile.GhostHouse;
        });
        
        let chosenDirection = ghost.direction;
        if (validMoves.length > 0) {
            chosenDirection = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
            // If stuck, reverse direction
            const opposite: Record<Direction, Direction> = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT', 'STOP': 'UP' };
            chosenDirection = opposite[ghost.direction];
        }

        const nextGhostPos = getNextPosition(ghost.position, chosenDirection);
        newGhost.position = nextGhostPos;
        newGhost.direction = chosenDirection;
        return newGhost;
    }));


    // --- Collision Detection with Ghosts ---
    setPacman(p => {
        for (const ghost of ghosts) {
            if (p.position.x === ghost.position.x && p.position.y === ghost.position.y) {
                if (ghost.isFrightened) {
                    setScore(s => s + 200);
                    setGhosts(gs => gs.map(g => g.id === ghost.id ? { ...g, position: g.startPosition, isFrightened: false, frightenedTimer: 0 } : g));
                } else {
                    setLives(l => {
                        const newLives = l - 1;
                        if (newLives > 0) {
                            resetPositions();
                            setGameState(GameState.Paused);
                            setTimeout(() => setGameState(GameState.Playing), 2000);
                        } else {
                            setGameState(GameState.GameOver);
                        }
                        return newLives;
                    });
                }
            }
        }
        return p;
    });


  }, [gameState, board, ghosts, resetPositions]);
  
  useEffect(() => {
    if(pelletCount === 0 && gameState === GameState.Playing) {
      setGameState(GameState.Won);
    }
  }, [pelletCount, gameState]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      const timer = setInterval(gameLoop, GAME_SPEED_MS);
      return () => clearInterval(timer);
    }
  }, [gameState, gameLoop]);


  return { gameState, board, pacman, ghosts, score, lives, startGame };
};
