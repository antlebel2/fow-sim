'use client';

import { useGameStore } from '../store/gameStore';

export default function DebugPanel() {
  const { players, currentPlayerIndex, phase, step } = useGameStore();

  if (players.length === 0) return null;

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 text-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Current Player:</strong> {currentPlayer.name}</p>
          <p><strong>Phase:</strong> {phase}</p>
          <p><strong>Step:</strong> {step}</p>
        </div>
        <div>
          <p><strong>Hand:</strong> {currentPlayer.hand.length} cards</p>
          <p><strong>Field:</strong> {currentPlayer.field.length} cards</p>
          <p><strong>Deck:</strong> {currentPlayer.deck.length} cards</p>
          <p><strong>Graveyard:</strong> {currentPlayer.graveyard.length} cards</p>
        </div>
      </div>
      <div className="mt-2">
        <p><strong>Hand Cards:</strong></p>
        <div className="flex flex-wrap gap-1">
          {currentPlayer.hand.map((card, index) => (
            <span key={index} className="bg-gray-700 px-1 rounded text-xs">
              {card.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
