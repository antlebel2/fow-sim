import { Card, CardType, Rarity } from '../types/game';
import { getSampleCards, convertToGameCard } from '../utils/cardParser';

// Use real Force of Will cards
export const sampleCards: Card[] = getSampleCards(15).map(convertToGameCard) as Card[];

export const createSampleDeck = (): Card[] => {
  // Use the real Force of Will deck creation from the parser
  const { createSampleDeck: createFOWDeck } = require('../utils/cardParser');
  return createFOWDeck();
};
