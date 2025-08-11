'use client';

import { useGameStore } from '../store/gameStore';
import { GamePhase, GameStep } from '../types/game';

export default function GameControls() {
  const { 
    players, 
    currentPlayerIndex, 
    phase, 
    step, 
    drawCard, 
    nextPhase, 
    nextStep, 
    endTurn,
    setLife,
    setWill
  } = useGameStore();

  if (players.length === 0) return null;

  const currentPlayer = players[currentPlayerIndex];

  const handleDrawCard = () => {
    drawCard(currentPlayer.id, 1);
  };

  const handleDrawInitialHand = () => {
    drawCard(currentPlayer.id, 5);
  };

  const handleAddWill = () => {
    setWill(currentPlayer.id, currentPlayer.will + 1);
  };

  const handleRemoveWill = () => {
    setWill(currentPlayer.id, Math.max(0, currentPlayer.will - 1));
  };

  const handleDamage = () => {
    setLife(currentPlayer.id, currentPlayer.life - 500);
  };

  const handleHeal = () => {
    setLife(currentPlayer.id, Math.min(currentPlayer.maxLife, currentPlayer.life + 500));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="text-lg font-bold mb-3">Game Controls</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button
          onClick={handleDrawCard}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          Draw Card
        </button>
        <button
          onClick={handleDrawInitialHand}
          className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
        >
          Draw 5 Cards
        </button>
        <button
          onClick={nextPhase}
          className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600"
        >
          Next Phase
        </button>
        <button
          onClick={nextStep}
          className="bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600"
        >
          Next Step
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button
          onClick={handleAddWill}
          className="bg-cyan-500 text-white px-3 py-2 rounded text-sm hover:bg-cyan-600"
        >
          +1 Will
        </button>
        <button
          onClick={handleRemoveWill}
          className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
        >
          -1 Will
        </button>
        <button
          onClick={handleDamage}
          className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
        >
          Take 500 Damage
        </button>
        <button
          onClick={handleHeal}
          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
        >
          Heal 500
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={endTurn}
          className="bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-900"
        >
          End Turn
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Current Phase:</strong> {phase}</p>
        <p><strong>Current Step:</strong> {step}</p>
        <p><strong>Current Player:</strong> {currentPlayer.name}</p>
        <p><strong>Hand Size:</strong> {currentPlayer.hand.length}</p>
        <p><strong>Deck Size:</strong> {currentPlayer.deck.length}</p>
      </div>
    </div>
  );
}
