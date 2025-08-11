'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../types/game';

interface DeckCard extends Card {
  count: number;
}

interface SavedDeck {
  name: string;
  cards: DeckCard[];
  stats: {
    totalCards: number;
    typeCounts: Record<string, number>;
  };
  createdAt: string;
}

export default function DecksPage() {
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);

  useEffect(() => {
    const decks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    setSavedDecks(decks);
  }, []);

  const deleteDeck = (index: number) => {
    if (confirm('Are you sure you want to delete this deck?')) {
      const updatedDecks = savedDecks.filter((_, i) => i !== index);
      localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
      setSavedDecks(updatedDecks);
    }
  };

  const loadDeckToBuilder = (deck: SavedDeck) => {
    // For now, just show an alert. In a real app, you'd navigate to deck builder with the deck data
    alert(`Loading deck: ${deck.name}\nThis would open the deck builder with ${deck.stats.totalCards} cards.`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Force of Will Simulator</h1>
          <div className="flex gap-4">
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition-colors"
            >
              Play Game
            </Link>
            <Link 
              href="/deckbuilder" 
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
            >
              Deck Builder
            </Link>
            <Link 
              href="/decks" 
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
            >
              My Decks
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Decks</h1>
                <p className="text-gray-600">Manage your saved Force of Will decks</p>
              </div>
              <Link 
                href="/deckbuilder" 
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create New Deck
              </Link>
            </div>
          </div>

          {/* Decks Grid */}
          {savedDecks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No decks yet</h3>
              <p className="text-gray-600 mb-6">Start building your first Force of Will deck!</p>
              <Link 
                href="/deckbuilder" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Deck
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDecks.map((deck, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{deck.name}</h3>
                    <button
                      onClick={() => deleteDeck(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Cards:</span> {deck.stats.totalCards}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Card Types:</span>
                      <div className="mt-1 space-y-1">
                        {Object.entries(deck.stats.typeCounts).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span>{type}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Created: {new Date(deck.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadDeckToBuilder(deck)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit Deck
                    </button>
                    <button
                      onClick={() => alert(`Starting game with ${deck.name}`)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Play Deck
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
