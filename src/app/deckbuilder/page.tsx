'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../types/game';
import { getAllCards, convertToGameCard, ForceOfWillCard } from '../../utils/cardParser';

interface DeckCard extends Card {
    count: number;
}

export default function DeckBuilder() {
    const [allCards, setAllCards] = useState<ForceOfWillCard[]>([]);
    const [filteredCards, setFilteredCards] = useState<ForceOfWillCard[]>([]);
    const [deck, setDeck] = useState<DeckCard[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [selectedColor, setSelectedColor] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCards = async () => {
            try {
                const cards = getAllCards();
                setAllCards(cards);
                setFilteredCards(cards);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading cards:', error);
                setIsLoading(false);
            }
        };
        loadCards();
    }, []);

    useEffect(() => {
        let filtered = allCards;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(card =>
                card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.abilities?.some(ability => ability.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter(card =>
                card.type.some(t => t.toLowerCase().includes(selectedType.toLowerCase()))
            );
        }

        // Filter by rarity
        if (selectedRarity !== 'all') {
            filtered = filtered.filter(card =>
                card.rarity.toLowerCase() === selectedRarity.toLowerCase()
            );
        }

        // Filter by color
        if (selectedColor !== 'all') {
            filtered = filtered.filter(card =>
                card.colour?.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()))
            );
        }

        // Sort cards
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'cost':
                    const costA = parseInt(a.cost?.replace(/[{}]/g, '') || '0');
                    const costB = parseInt(b.cost?.replace(/[{}]/g, '') || '0');
                    return costA - costB;
                case 'rarity':
                    return a.rarity.localeCompare(b.rarity);
                default:
                    return 0;
            }
        });

        setFilteredCards(filtered);
    }, [allCards, searchTerm, selectedType, selectedRarity, selectedColor, sortBy]);

    const addToDeck = (card: ForceOfWillCard) => {
        const gameCard = convertToGameCard(card);
        setDeck(prevDeck => {
            const existingCard = prevDeck.find(deckCard => deckCard.id === gameCard.id);
            if (existingCard) {
                return prevDeck.map(deckCard =>
                    deckCard.id === gameCard.id
                        ? { ...deckCard, count: Math.min(deckCard.count + 1, 4) }
                        : deckCard
                );
            } else {
                return [...prevDeck, { ...gameCard, count: 1 }];
            }
        });
    };

    const removeFromDeck = (cardId: string) => {
        setDeck(prevDeck => {
            const existingCard = prevDeck.find(deckCard => deckCard.id === cardId);
            if (existingCard && existingCard.count > 1) {
                return prevDeck.map(deckCard =>
                    deckCard.id === cardId
                        ? { ...deckCard, count: deckCard.count - 1 }
                        : deckCard
                );
            } else {
                return prevDeck.filter(deckCard => deckCard.id !== cardId);
            }
        });
    };

    const getDeckStats = () => {
        const totalCards = deck.reduce((sum, card) => sum + card.count, 0);
        const typeCounts = deck.reduce((counts, card) => {
            counts[card.type] = (counts[card.type] || 0) + card.count;
            return counts;
        }, {} as Record<string, number>);

        return { totalCards, typeCounts };
    };

    const saveDeck = () => {
        const deckData = {
            name: `Deck ${new Date().toLocaleDateString()}`,
            cards: deck,
            stats: getDeckStats(),
            createdAt: new Date().toISOString()
        };

        // Save to localStorage for now
        const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
        savedDecks.push(deckData);
        localStorage.setItem('savedDecks', JSON.stringify(savedDecks));

        alert('Deck saved!');
    };

    const clearDeck = () => {
        if (confirm('Are you sure you want to clear the deck?')) {
            setDeck([]);
        }
    };

    if (isLoading) {
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
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-lg">Loading Force of Will cards...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Force of Will Deck Builder</h1>
                        <p className="text-gray-600">Search and build your perfect deck from {allCards.length} cards</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Card Search Panel */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Card Search</h2>

                                {/* Search and Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Search cards..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="ruler">Ruler</option>
                                        <option value="resonator">Resonator</option>
                                        <option value="spell">Spell</option>
                                        <option value="addition">Addition</option>
                                        <option value="regalia">Regalia</option>
                                    </select>

                                    <select
                                        value={selectedRarity}
                                        onChange={(e) => setSelectedRarity(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Rarities</option>
                                        <option value="c">Common</option>
                                        <option value="u">Uncommon</option>
                                        <option value="r">Rare</option>
                                        <option value="sr">Super Rare</option>
                                        <option value="mr">Mythic Rare</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="cost">Sort by Cost</option>
                                        <option value="rarity">Sort by Rarity</option>
                                    </select>
                                </div>

                                {/* Results Count */}
                                <p className="text-sm text-gray-600 mb-4">
                                    Showing {filteredCards.length} of {allCards.length} cards
                                </p>

                                {/* Card Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                    {filteredCards.slice(0, 30).map((card) => (
                                        <div
                                            key={card.id}
                                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => addToDeck(card)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-sm text-gray-900 truncate">{card.name}</h3>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {card.cost || '0'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600 mb-2">
                                                <span className="bg-gray-200 px-2 py-1 rounded mr-1">
                                                    {card.type[0]}
                                                </span>
                                                <span className="bg-purple-200 px-2 py-1 rounded">
                                                    {card.rarity}
                                                </span>
                                            </div>
                                            {card.ATK && card.DEF && (
                                                <div className="text-xs text-gray-600">
                                                    ATK: {card.ATK} / DEF: {card.DEF}
                                                </div>
                                            )}
                                            {card.abilities && card.abilities[0] && (
                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                    {card.abilities[0]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {filteredCards.length > 30 && (
                                    <p className="text-sm text-gray-500 mt-4 text-center">
                                        Showing first 30 results. Use filters to narrow down your search.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Deck Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Your Deck</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={saveDeck}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={clearDeck}
                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Deck Stats */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h3 className="font-semibold mb-2">Deck Statistics</h3>
                                    <div className="text-sm space-y-1">
                                        <div>Total Cards: {getDeckStats().totalCards}</div>
                                        {Object.entries(getDeckStats().typeCounts).map(([type, count]) => (
                                            <div key={type}>{type}: {count}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deck List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {deck.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No cards in deck yet</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {deck.map((deckCard) => (
                                                <div
                                                    key={deckCard.id}
                                                    className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-medium text-sm">{deckCard.name}</h4>
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {deckCard.cost}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            {deckCard.type} • {deckCard.rarity}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-3">
                                                        <span className="text-sm font-semibold">{deckCard.count}</span>
                                                        <button
                                                            onClick={() => removeFromDeck(deckCard.id)}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
