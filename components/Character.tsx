
import React from 'react';
import { TILE_SIZE } from '../constants';
import { Position, Direction } from '../types';

interface CharacterProps {
  position: Position;
  direction: Direction;
  color: string;
  type: 'pacman' | 'ghost';
}

const Character: React.FC<CharacterProps> = ({ position, direction, color, type }) => {
  const style: React.CSSProperties = {
    top: position.y * TILE_SIZE,
    left: position.x * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    transition: 'top 100ms linear, left 100ms linear',
  };

  const rotation: Record<Direction, string> = {
    UP: '-rotate-90',
    DOWN: 'rotate-90',
    LEFT: 'rotate-180',
    RIGHT: 'rotate-0',
    STOP: 'rotate-0',
  };
  
  const ghostBody = (
    <div className={`w-full h-full bg-${color} rounded-t-full relative`}>
        <div className="absolute bottom-0 w-full h-1/3 flex">
            <div className="w-1/3 h-full bg-black" style={{clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'}}></div>
            <div className="w-1/3 h-full bg-black" style={{clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'}}></div>
            <div className="w-1/3 h-full bg-black" style={{clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'}}></div>
        </div>
      <div className="absolute top-1/4 w-full flex justify-center space-x-1">
        <div className="w-2 h-2 bg-white rounded-full">
            <div className={`w-1 h-1 bg-black rounded-full ${color === 'blue-500' ? 'mx-auto my-auto' : 'ml-0.5'}`}></div>
        </div>
        <div className="w-2 h-2 bg-white rounded-full">
            <div className={`w-1 h-1 bg-black rounded-full ${color === 'blue-500' ? 'mx-auto my-auto' : 'ml-0.5'}`}></div>
        </div>
      </div>
    </div>
  );

  const pacmanBody = (
     <div className={`w-full h-full bg-yellow-400 rounded-full transform ${rotation[direction]}`} style={{
         clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 50% 50%, 100% 60%, 100% 100%, 0% 100%)'
     }}></div>
  );

  return (
    <div className="absolute" style={style}>
        {type === 'pacman' ? pacmanBody : ghostBody}
    </div>
  );
};

export default Character;
