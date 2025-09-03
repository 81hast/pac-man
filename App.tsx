
import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameState } from './types';
import Board from './components/Board';
import Character from './components/Character';
import Scoreboard from './components/Scoreboard';
import GameOverlay from './components/GameOverlay';
import { TILE_SIZE, GHOSTS_CONFIG } from './constants';

const App: React.FC = () => {
  const {
    gameState,
    board,
    pacman,
    ghosts,
    score,
    lives,
    startGame,
  } = useGameLogic();

  const boardWidth = board[0].length * TILE_SIZE;
  const boardHeight = board.length * TILE_SIZE;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono p-4">
      <h1 className="text-5xl font-bold text-yellow-400 mb-2 tracking-widest">PAC-MAN</h1>
      <p className="text-neutral-400 mb-4">A React & Tailwind CSS Demo</p>
      
      <Scoreboard score={score} lives={lives} />

      <div
        className="relative bg-black border-4 border-blue-600 shadow-lg shadow-blue-500/50"
        style={{ width: boardWidth, height: boardHeight }}
      >
        {gameState !== GameState.Ready && <Board board={board} />}
        
        <GameOverlay gameState={gameState} score={score} onStart={startGame} />

        {gameState === GameState.Playing && (
          <>
            <Character
              position={pacman.position}
              direction={pacman.direction}
              color="yellow"
              type="pacman"
            />
            {ghosts.map((ghost, index) => (
              <Character
                key={ghost.id}
                position={ghost.position}
                direction={ghost.direction}
                color={ghost.isFrightened ? 'blue-500' : GHOSTS_CONFIG[index].color}
                type="ghost"
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-6 text-center text-gray-400">
        <p>Use <span className="text-yellow-400 font-semibold">Arrow Keys</span> to move.</p>
        <p>Eat all the dots to win. Avoid the ghosts!</p>
      </div>
    </div>
  );
};

export default App;
