import { create } from 'zustand';
import { GameState, Player, Card, GamePhase, GameStep, GameAction } from '../types/game';
import { createSampleDeck } from '../data/sampleCards';

interface GameStore extends GameState {
  // Actions
  initializeGame: (player1Name: string, player2Name: string) => void;
  drawCard: (playerId: string, count?: number) => void;
  playCard: (playerId: string, cardId: string, targetZone: string) => void;
  moveCard: (playerId: string, cardId: string, fromZone: string, toZone: string) => void;
  nextPhase: () => void;
  nextStep: () => void;
  endTurn: () => void;
  setLife: (playerId: string, life: number) => void;
  setWill: (playerId: string, will: number) => void;
  addAction: (action: GameAction) => void;
}

const createInitialPlayer = (id: string, name: string): Player => {
  const deck = createSampleDeck();
  const ruler = deck.find(card => card.type === 'RULER');
  const remainingDeck = deck.filter(card => card.type !== 'RULER');
  
  return {
    id,
    name,
    life: 4000,
    maxLife: 4000,
    hand: [],
    deck: remainingDeck,
    graveyard: [],
    field: [],
    rulerZone: ruler || null,
    jRulerZone: null,
    magicStoneDeck: [],
    magicStoneField: [],
    will: 0,
    maxWill: 0,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  turn: 1,
  phase: GamePhase.RECOVERY,
  step: GameStep.BEGINNING_OF_TURN,
  isGameOver: false,
  winner: null,

  initializeGame: (player1Name: string, player2Name: string) => {
    const player1 = createInitialPlayer('player1', player1Name);
    const player2 = createInitialPlayer('player2', player2Name);
    
    set({
      players: [player1, player2],
      currentPlayerIndex: 0,
      turn: 1,
      phase: GamePhase.RECOVERY,
      step: GameStep.BEGINNING_OF_TURN,
      isGameOver: false,
      winner: null,
    });
  },

  drawCard: (playerId: string, count = 1) => {
    set((state) => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;

      const player = state.players[playerIndex];
      const drawnCards = player.deck.slice(0, count);
      const remainingDeck = player.deck.slice(count);

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        hand: [...player.hand, ...drawnCards],
        deck: remainingDeck,
      };

      return { players: updatedPlayers };
    });
  },

  playCard: (playerId: string, cardId: string, targetZone: string) => {
    set((state) => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        console.log('Player not found for playCard:', playerId);
        return state;
      }

      const player = state.players[playerIndex];
      const cardIndex = player.hand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) {
        console.log('Card not found in hand:', { cardId, handCards: player.hand.map(c => c.id) });
        return state;
      }

      const card = player.hand[cardIndex];
      const updatedHand = player.hand.filter((_, index) => index !== cardIndex);

      // Safely get the target zone cards
      let targetZoneCards: Card[] = [];
      switch (targetZone) {
        case 'hand':
          targetZoneCards = player.hand;
          break;
        case 'deck':
          targetZoneCards = player.deck;
          break;
        case 'field':
          targetZoneCards = player.field;
          break;
        case 'graveyard':
          targetZoneCards = player.graveyard;
          break;
        case 'magicStoneField':
          targetZoneCards = player.magicStoneField;
          break;
        default:
          console.log('Invalid targetZone:', targetZone);
          return state;
      }

      const updatedTargetZone = [...targetZoneCards, card];

      console.log('Playing card:', { cardId, targetZone, cardName: card.name });

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        hand: updatedHand,
        [targetZone]: updatedTargetZone,
      };

      return { players: updatedPlayers };
    });
  },

  moveCard: (playerId: string, cardId: string, fromZone: string, toZone: string) => {
    set((state) => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        console.log('Player not found:', playerId);
        return state;
      }

      const player = state.players[playerIndex];
      
      // Safely get the source zone cards
      let fromZoneCards: Card[] = [];
      switch (fromZone) {
        case 'hand':
          fromZoneCards = player.hand;
          break;
        case 'deck':
          fromZoneCards = player.deck;
          break;
        case 'field':
          fromZoneCards = player.field;
          break;
        case 'graveyard':
          fromZoneCards = player.graveyard;
          break;
        case 'magicStoneField':
          fromZoneCards = player.magicStoneField;
          break;
        default:
          console.log('Invalid fromZone:', fromZone);
          return state;
      }

      const cardIndex = fromZoneCards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) {
        console.log('Card not found in zone:', { cardId, fromZone, availableCards: fromZoneCards.map(c => c.id) });
        return state;
      }

      const card = fromZoneCards[cardIndex];
      const updatedFromZone = fromZoneCards.filter((_, index) => index !== cardIndex);

      // Safely get the target zone cards
      let toZoneCards: Card[] = [];
      switch (toZone) {
        case 'hand':
          toZoneCards = player.hand;
          break;
        case 'deck':
          toZoneCards = player.deck;
          break;
        case 'field':
          toZoneCards = player.field;
          break;
        case 'graveyard':
          toZoneCards = player.graveyard;
          break;
        case 'magicStoneField':
          toZoneCards = player.magicStoneField;
          break;
        default:
          console.log('Invalid toZone:', toZone);
          return state;
      }

      const updatedToZone = [...toZoneCards, card];

      console.log('Moving card:', { cardId, fromZone, toZone, cardName: card.name });

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        [fromZone]: updatedFromZone,
        [toZone]: updatedToZone,
      };

      return { players: updatedPlayers };
    });
  },

  nextPhase: () => {
    set((state) => {
      const phases = Object.values(GamePhase);
      const currentPhaseIndex = phases.indexOf(state.phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      
      return { phase: phases[nextPhaseIndex] };
    });
  },

  nextStep: () => {
    set((state) => {
      const steps = Object.values(GameStep);
      const currentStepIndex = steps.indexOf(state.step);
      const nextStepIndex = (currentStepIndex + 1) % steps.length;
      
      return { step: steps[nextStepIndex] };
    });
  },

  endTurn: () => {
    set((state) => ({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      turn: state.currentPlayerIndex === 0 ? state.turn + 1 : state.turn,
      phase: GamePhase.RECOVERY,
      step: GameStep.BEGINNING_OF_TURN,
    }));
  },

  setLife: (playerId: string, life: number) => {
    set((state) => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        life: Math.max(0, life),
      };

      // Check for game over
      if (life <= 0) {
        const winner = state.players.find(p => p.id !== playerId)?.id || null;
        return { 
          players: updatedPlayers, 
          isGameOver: true, 
          winner 
        };
      }

      return { players: updatedPlayers };
    });
  },

  setWill: (playerId: string, will: number) => {
    set((state) => {
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        will: Math.max(0, will),
      };

      return { players: updatedPlayers };
    });
  },

  addAction: (action: GameAction) => {
    // This could be used for action history or replay functionality
    console.log('Game Action:', action);
  },
}));
