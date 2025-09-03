
import React from 'react';
import { GameState } from '../types';

interface GameOverlayProps {
  gameState: GameState;
  score: number;
  onStart: () => void;
}

const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center p-4 z-10">
        {children}
    </div>
);

const GameOverlay: React.FC<GameOverlayProps> = ({ gameState, score, onStart }) => {
  const renderContent = () => {
    switch (gameState) {
      case GameState.Ready:
        return (
          <Overlay>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4 animate-pulse">READY?</h2>
            <button
              onClick={onStart}
              className="px-6 py-3 bg-yellow-400 text-black font-bold text-xl rounded-lg shadow-lg hover:bg-yellow-300 transition-colors"
            >
              Start Game
            </button>
          </Overlay>
        );
      case GameState.GameOver:
        return (
          <Overlay>
            <h2 className="text-5xl font-bold text-red-600 mb-2">GAME OVER</h2>
            <p className="text-2xl text-white mb-6">Final Score: {score}</p>
            <button
              onClick={onStart}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
            >
              Play Again
            </button>
          </Overlay>
        );
      case GameState.Won:
        return (
          <Overlay>
            <h2 className="text-5xl font-bold text-green-500 mb-2">YOU WIN!</h2>
            <p className="text-2xl text-white mb-6">Final Score: {score}</p>
            <button
              onClick={onStart}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
            >
              Play Again
            </button>
          </Overlay>
        );
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default GameOverlay;
