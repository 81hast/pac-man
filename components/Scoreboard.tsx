
import React from 'react';

interface ScoreboardProps {
  score: number;
  lives: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, lives }) => {
  return (
    <div className="w-full max-w-lg flex justify-between items-center text-xl p-2 mb-4">
      <div>
        <span className="text-gray-400">SCORE: </span>
        <span className="text-white font-bold">{score}</span>
      </div>
      <div className="flex items-center">
         <span className="text-gray-400 mr-2">LIVES: </span>
        {Array.from({ length: lives }).map((_, i) => (
          <div key={i} className="w-5 h-5 bg-yellow-400 rounded-full ml-1 border-2 border-yellow-600"></div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;
