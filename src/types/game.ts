export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  power?: number;
  defense?: number;
  text: string;
  imageUrl?: string;
  rarity: Rarity;
  set: string;
  cardNumber: string;
}

export enum CardType {
  RULER = 'RULER',
  J_RULER = 'J_RULER',
  RESONATOR = 'RESONATOR',
  SPELL = 'SPELL',
  ADDITION = 'ADDITION',
  REGALIA = 'REGALIA',
  CHANT = 'CHANT',
  INSTANT = 'INSTANT'
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  SUPER_RARE = 'SUPER_RARE',
  MYTHIC_RARE = 'MYTHIC_RARE'
}

export enum GameZone {
  DECK = 'DECK',
  HAND = 'HAND',
  FIELD = 'FIELD',
  GRAVEYARD = 'GRAVEYARD',
  RULER_ZONE = 'RULER_ZONE',
  J_RULER_ZONE = 'J_RULER_ZONE',
  MAGIC_STONE_DECK = 'MAGIC_STONE_DECK',
  MAGIC_STONE_FIELD = 'MAGIC_STONE_FIELD'
}

export interface Player {
  id: string;
  name: string;
  life: number;
  maxLife: number;
  hand: Card[];
  deck: Card[];
  graveyard: Card[];
  field: Card[];
  rulerZone: Card | null;
  jRulerZone: Card | null;
  magicStoneDeck: Card[];
  magicStoneField: Card[];
  will: number;
  maxWill: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  phase: GamePhase;
  step: GameStep;
  isGameOver: boolean;
  winner: string | null;
}

export enum GamePhase {
  RECOVERY = 'RECOVERY',
  DRAW = 'DRAW',
  MAIN = 'MAIN',
  END = 'END'
}

export enum GameStep {
  BEGINNING_OF_TURN = 'BEGINNING_OF_TURN',
  RECOVERY_STEP = 'RECOVERY_STEP',
  DRAW_STEP = 'DRAW_STEP',
  MAIN_STEP = 'MAIN_STEP',
  END_STEP = 'END_STEP',
  END_OF_TURN = 'END_OF_TURN'
}

export interface GameAction {
  type: string;
  payload: any;
  playerId: string;
  timestamp: number;
}
