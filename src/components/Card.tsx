'use client';

import { Card as CardType } from '../types/game';
import { useDraggable } from '@dnd-kit/core';

interface CardProps {
  card: CardType;
  zone: string;
  playerId: string;
  onClick?: () => void;
  className?: string;
}

export default function Card({ card, zone, playerId, onClick, className = '' }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${playerId}-${zone.toLowerCase()}-${card.id}`,
    data: {
      card,
      zone,
      playerId,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={onClick}
      className={`
        relative w-24 h-32 bg-white border-2 border-gray-300 rounded-lg shadow-md
        cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:scale-105
        ${isDragging ? 'opacity-50 rotate-12 shadow-xl z-50 scale-110' : ''}
        ${className}
      `}
    >
      {/* Card Header */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-between px-1">
        <span className="text-xs font-bold text-white truncate">{card.name}</span>
        <span className="text-xs font-bold text-white bg-black bg-opacity-30 rounded px-1">
          {card.cost}
        </span>
      </div>

      {/* Card Type */}
      <div className="absolute top-6 left-0 right-0 h-4 bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-700 font-medium">
          {card.type.replace('_', ' ')}
        </span>
      </div>

      {/* Card Image Placeholder */}
      <div className="absolute top-10 left-1 right-1 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="text-xs text-gray-500 text-center">
            {card.type === 'RESONATOR' ? '⚔️' : 
             card.type === 'SPELL' ? '✨' : 
             card.type === 'RULER' ? '👑' : '🃏'}
          </div>
        )}
      </div>

      {/* Power/Defense for Resonators */}
      {card.power !== undefined && card.defense !== undefined && (
        <div className="absolute bottom-8 left-0 right-0 h-4 flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-red-600">⚔️ {card.power}</span>
          <span className="text-xs font-bold text-blue-600">🛡️ {card.defense}</span>
        </div>
      )}

      {/* Card Text */}
      <div className="absolute bottom-2 left-1 right-1 h-6">
        <p className="text-xs text-gray-700 leading-tight overflow-hidden">
          {card.text.length > 50 ? `${card.text.substring(0, 50)}...` : card.text}
        </p>
      </div>

      {/* Rarity Indicator */}
      <div className="absolute top-1 right-1">
        <div className={`
          w-2 h-2 rounded-full
          ${card.rarity === 'COMMON' ? 'bg-gray-400' :
            card.rarity === 'UNCOMMON' ? 'bg-green-400' :
            card.rarity === 'RARE' ? 'bg-blue-400' :
            card.rarity === 'SUPER_RARE' ? 'bg-purple-400' :
            'bg-yellow-400'}
        `} />
      </div>
    </div>
  );
}
