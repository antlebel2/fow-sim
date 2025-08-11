import { Card, CardType, Rarity } from '../types/game';

export const sampleCards: Card[] = [
  // Rulers
  {
    id: 'ruler-1',
    name: 'Faria, the Sacred Queen',
    type: CardType.RULER,
    cost: 0,
    text: 'Ruler: Faria, the Sacred Queen. [Activate] Pay 2 will: Search your deck for a light resonator and put it into your hand.',
    rarity: Rarity.RARE,
    set: 'TAT',
    cardNumber: 'TAT-001',
  },
  {
    id: 'ruler-2',
    name: 'Melgis, the Flame King',
    type: CardType.RULER,
    cost: 0,
    text: 'Ruler: Melgis, the Flame King. [Activate] Pay 2 will: This card deals 500 damage to target resonator.',
    rarity: Rarity.RARE,
    set: 'TAT',
    cardNumber: 'TAT-002',
  },

  // Resonators
  {
    id: 'resonator-1',
    name: 'Knight of the New Moon',
    type: CardType.RESONATOR,
    cost: 2,
    power: 800,
    defense: 800,
    text: 'Light resonator. When this card enters the field, you may search your deck for a light resonator with cost 1 or less and put it into your hand.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-003',
  },
  {
    id: 'resonator-2',
    name: 'Flame Dragon of Altea',
    type: CardType.RESONATOR,
    cost: 4,
    power: 1200,
    defense: 1000,
    text: 'Fire resonator. Flying. When this card enters the field, it deals 500 damage to target resonator.',
    rarity: Rarity.UNCOMMON,
    set: 'TAT',
    cardNumber: 'TAT-004',
  },
  {
    id: 'resonator-3',
    name: 'Dark Elf',
    type: CardType.RESONATOR,
    cost: 3,
    power: 900,
    defense: 900,
    text: 'Dark resonator. When this card enters the field, target resonator gets -500/-500 until end of turn.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-005',
  },
  {
    id: 'resonator-4',
    name: 'Water Dragon',
    type: CardType.RESONATOR,
    cost: 5,
    power: 1500,
    defense: 1200,
    text: 'Water resonator. Flying. When this card attacks, target resonator cannot block this turn.',
    rarity: Rarity.RARE,
    set: 'TAT',
    cardNumber: 'TAT-006',
  },

  // Spells
  {
    id: 'spell-1',
    name: 'Light of Hope',
    type: CardType.SPELL,
    cost: 1,
    text: 'Light chant. Target resonator gets +500/+500 until end of turn.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-007',
  },
  {
    id: 'spell-2',
    name: 'Flame of Outer World',
    type: CardType.SPELL,
    cost: 2,
    text: 'Fire chant. This card deals 800 damage to target resonator.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-008',
  },
  {
    id: 'spell-3',
    name: 'Darkness',
    type: CardType.SPELL,
    cost: 3,
    text: 'Dark chant. Destroy target resonator with cost 2 or less.',
    rarity: Rarity.UNCOMMON,
    set: 'TAT',
    cardNumber: 'TAT-009',
  },
  {
    id: 'spell-4',
    name: 'Water Ball',
    type: CardType.SPELL,
    cost: 1,
    text: 'Water chant. This card deals 400 damage to target resonator.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-010',
  },

  // Magic Stones
  {
    id: 'stone-1',
    name: 'Magic Stone of Light',
    type: CardType.REGALIA,
    cost: 0,
    text: 'Magic stone. [Activate] Produce 1 light will.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-011',
  },
  {
    id: 'stone-2',
    name: 'Magic Stone of Fire',
    type: CardType.REGALIA,
    cost: 0,
    text: 'Magic stone. [Activate] Produce 1 fire will.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-012',
  },
  {
    id: 'stone-3',
    name: 'Magic Stone of Darkness',
    type: CardType.REGALIA,
    cost: 0,
    text: 'Magic stone. [Activate] Produce 1 dark will.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-013',
  },
  {
    id: 'stone-4',
    name: 'Magic Stone of Water',
    type: CardType.REGALIA,
    cost: 0,
    text: 'Magic stone. [Activate] Produce 1 water will.',
    rarity: Rarity.COMMON,
    set: 'TAT',
    cardNumber: 'TAT-014',
  },
];

export const createSampleDeck = (): Card[] => {
  const deck: Card[] = [];
  
  // Add 1 ruler
  deck.push(sampleCards[0]); // Faria
  
  // Add 20 magic stones
  for (let i = 0; i < 5; i++) {
    deck.push(sampleCards[10]); // Light stones
    deck.push(sampleCards[11]); // Fire stones
    deck.push(sampleCards[12]); // Dark stones
    deck.push(sampleCards[13]); // Water stones
  }
  
  // Add resonators
  for (let i = 0; i < 3; i++) {
    deck.push(sampleCards[2]); // Knight of the New Moon
    deck.push(sampleCards[3]); // Flame Dragon
    deck.push(sampleCards[4]); // Dark Elf
    deck.push(sampleCards[5]); // Water Dragon
  }
  
  // Add spells
  for (let i = 0; i < 2; i++) {
    deck.push(sampleCards[6]); // Light of Hope
    deck.push(sampleCards[7]); // Flame of Outer World
    deck.push(sampleCards[8]); // Darkness
    deck.push(sampleCards[9]); // Water Ball
  }
  
  // Shuffle the deck
  return deck.sort(() => Math.random() - 0.5);
};
