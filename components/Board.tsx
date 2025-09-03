
import React from 'react';
import { TILE_SIZE } from '../constants';
import { Tile } from '../types';

interface BoardProps {
  board: Tile[][];
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div>
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tile, x) => {
            const key = `${y}-${x}`;
            let tileClass = 'w-5 h-5';
            let content = null;

            if (tile === Tile.Wall) {
              tileClass += ' bg-blue-800';
            } else if (tile === Tile.Pellet) {
              content = <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full mx-auto my-[7px]"></div>;
            } else if (tile === Tile.PowerPellet) {
              content = <div className="w-3 h-3 bg-yellow-300 rounded-full mx-auto my-[4px] animate-pulse"></div>;
            }
            
            return (
              <div key={key} className={tileClass} style={{ width: TILE_SIZE, height: TILE_SIZE }}>
                {content}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
