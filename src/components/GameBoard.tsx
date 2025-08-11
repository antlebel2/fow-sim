'use client';

import { useDroppable } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import Card from './Card';
import GameControls from './GameControls';
import DebugPanel from './DebugPanel';
import Instructions from './Instructions';
import TestDropZone from './TestDropZone';
import { GameZone } from '../types/game';

interface GameZoneProps {
    zone?: GameZone;
    playerId: string;
    cards: any[];
    title: string;
    className?: string;
}

function GameZoneComponent({ zone, playerId, cards, title, className = '' }: GameZoneProps) {
    const { setNodeRef, isOver, active } = useDroppable({
        id: `${playerId}-${zone?.toLowerCase() || 'unknown'}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`
        min-h-32 p-2 border-2 border-dashed rounded-lg transition-all duration-200
        ${isOver ? 'border-blue-500 bg-blue-100 scale-105' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
        ${active ? 'border-yellow-400 bg-yellow-50' : ''}
        ${className}
      `}
        >
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
            <div className="flex flex-wrap gap-1 min-h-20">
                {cards.length === 0 ? (
                    <div className="w-full h-20 flex items-center justify-center text-gray-400 text-xs">
                        Drop cards here ({zone})
                    </div>
                ) : (
                    cards.map((card, index) => (
                        <Card
                            key={`${card.id}-${index}`}
                            card={card}
                            zone={zone || 'unknown'}
                            playerId={playerId}
                            className="w-20 h-28"
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default function GameBoard() {
    const {
        players,
        currentPlayerIndex,
        turn,
        phase,
        step,
        isGameOver,
        winner,
        nextPhase,
        nextStep,
        endTurn,
        drawCard
    } = useGameStore();

    if (players.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Force of Will TCG Simulator</h1>
                    <p className="text-gray-600 mb-4">No game in progress</p>
                    <button
                        onClick={() => useGameStore.getState().initializeGame('Player 1', 'Player 2')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Start New Game
                    </button>
                </div>
            </div>
        );
    }

    const currentPlayer = players[currentPlayerIndex];
    const opponent = players[(currentPlayerIndex + 1) % players.length];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
            {/* Game Overlay */}
            {isGameOver && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                        <p className="text-xl mb-4">
                            {winner ? `${players.find(p => p.id === winner)?.name} wins!` : 'Draw!'}
                        </p>
                        <button
                            onClick={() => useGameStore.getState().initializeGame('Player 1', 'Player 2')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <Instructions />

            {/* Debug Panel */}
            <DebugPanel />

            {/* Game Controls */}
            <GameControls />

            {/* Opponent's Side */}
            <div className="mb-8">
                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold">{opponent.name}</h2>
                        <div className="flex gap-4">
                            <span className="text-red-600 font-bold">❤️ {opponent.life}</span>
                            <span className="text-blue-600 font-bold">💎 {opponent.will}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <GameZoneComponent
                            zone={GameZone.DECK}
                            playerId={opponent.id}
                            cards={opponent.deck.slice(0, 3)}
                            title={`Deck (${opponent.deck.length})`}
                        />
                        <GameZoneComponent
                            zone={GameZone.FIELD}
                            playerId={opponent.id}
                            cards={opponent.field}
                            title="Field"
                        />
                        <GameZoneComponent
                            zone={GameZone.GRAVEYARD}
                            playerId={opponent.id}
                            cards={opponent.graveyard.slice(-3)}
                            title={`Graveyard (${opponent.graveyard.length})`}
                        />
                    </div>
                </div>
            </div>

            {/* Center Area - Ruler Zones */}
            <div className="flex justify-center mb-8">
                <div className="grid grid-cols-2 gap-8">
                    <GameZoneComponent
                        zone={GameZone.RULER_ZONE}
                        playerId={opponent.id}
                        cards={opponent.rulerZone ? [opponent.rulerZone] : []}
                        title="Ruler"
                        className="w-32"
                    />
                    <GameZoneComponent
                        zone={GameZone.RULER_ZONE}
                        playerId={currentPlayer.id}
                        cards={currentPlayer.rulerZone ? [currentPlayer.rulerZone] : []}
                        title="Ruler"
                        className="w-32"
                    />
                </div>
            </div>

            {/* Current Player's Side */}
            <div>
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold">{currentPlayer.name}</h2>
                        <div className="flex gap-4">
                            <span className="text-red-600 font-bold">❤️ {currentPlayer.life}</span>
                            <span className="text-blue-600 font-bold">💎 {currentPlayer.will}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <GameZoneComponent
                            zone={GameZone.DECK}
                            playerId={currentPlayer.id}
                            cards={currentPlayer.deck.slice(0, 3)}
                            title={`Deck (${currentPlayer.deck.length})`}
                        />
                        <GameZoneComponent
                            zone={GameZone.FIELD}
                            playerId={currentPlayer.id}
                            cards={currentPlayer.field}
                            title="Field"
                        />
                        <GameZoneComponent
                            zone={GameZone.GRAVEYARD}
                            playerId={currentPlayer.id}
                            cards={currentPlayer.graveyard.slice(-3)}
                            title={`Graveyard (${currentPlayer.graveyard.length})`}
                        />
                    </div>

                    {/* Hand */}
                    <GameZoneComponent
                        zone={GameZone.HAND}
                        playerId={currentPlayer.id}
                        cards={currentPlayer.hand}
                        title={`Hand (${currentPlayer.hand.length})`}
                        className="mb-4"
                    />

                    {/* Magic Stone Field */}
                    <GameZoneComponent
                        zone={GameZone.MAGIC_STONE_FIELD}
                        playerId={currentPlayer.id}
                        cards={currentPlayer.magicStoneField}
                        title={`Magic Stones (${currentPlayer.magicStoneField.length})`}
                    />

                    {/* Test Drop Zone */}
                    <TestDropZone />
                </div>
            </div>
        </div>
    );
}
