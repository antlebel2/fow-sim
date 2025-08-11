// Import the JSON data - handle the nested structure: fow -> clusters -> sets -> cards
let cardsData: any[] = [];
try {
  const importedData = require('../cards/cards.json');
  console.log('Imported data type:', typeof importedData);
  console.log('Root keys:', Object.keys(importedData || {}));
  
  if (importedData && importedData.fow && typeof importedData.fow === 'object') {
    console.log('Found fow object, keys:', Object.keys(importedData.fow));
    
    if (importedData.fow.clusters && Array.isArray(importedData.fow.clusters)) {
      console.log('Found clusters array, length:', importedData.fow.clusters.length);
      
      // Extract cards from the first few clusters to avoid memory issues
      const maxClusters = 2; // Limit to first 2 clusters for now
      const clustersToProcess = importedData.fow.clusters.slice(0, maxClusters);
      
      for (let i = 0; i < clustersToProcess.length; i++) {
        const cluster = clustersToProcess[i];
        console.log(`Cluster ${i} keys:`, Object.keys(cluster));
        
        if (cluster.sets && Array.isArray(cluster.sets)) {
          console.log(`Cluster ${i} has ${cluster.sets.length} sets`);
          
          for (const set of cluster.sets) {
            if (set.cards && Array.isArray(set.cards)) {
              console.log(`Set has ${set.cards.length} cards`);
              cardsData.push(...set.cards);
            }
          }
        }
      }
      
      console.log('Total cards extracted:', cardsData.length);
    }
  }
  
  console.log('Final cardsData length:', cardsData.length);
} catch (error) {
  console.error('Error loading cards data:', error);
  cardsData = [];
}

export interface ForceOfWillCard {
  id: string;
  name: string;
  type: string[];
  race?: string[];
  cost?: string;
  colour?: string[];
  ATK?: number | string;
  DEF?: number | string;
  abilities?: string[];
  divinity?: string;
  flavour?: string;
  artists?: string[];
  rarity: string;
}

// Get a sample of cards to understand the structure
export function getSampleCards(count: number = 10): ForceOfWillCard[] {
  if (!Array.isArray(cardsData)) {
    console.error('Cards data is not an array:', typeof cardsData);
    return [];
  }
  return cardsData.slice(0, count) as ForceOfWillCard[];
}

// Get all cards
export function getAllCards(): ForceOfWillCard[] {
  if (!Array.isArray(cardsData)) {
    console.error('Cards data is not an array:', typeof cardsData);
    return [];
  }
  return cardsData as ForceOfWillCard[];
}

// Get cards by type
export function getCardsByType(type: string): ForceOfWillCard[] {
  return getAllCards().filter(card => 
    card.type.some(t => t.toLowerCase().includes(type.toLowerCase()))
  );
}

// Get cards by rarity
export function getCardsByRarity(rarity: string): ForceOfWillCard[] {
  return getAllCards().filter(card => 
    card.rarity.toLowerCase() === rarity.toLowerCase()
  );
}

// Convert Force of Will card to our game card format
export function convertToGameCard(fowCard: ForceOfWillCard) {
  // Map Force of Will types to our CardType enum
  const mapType = (fowType: string): string => {
    const type = fowType.toLowerCase();
    if (type.includes('ruler')) return 'RULER';
    if (type.includes('j-ruler')) return 'J_RULER';
    if (type.includes('resonator')) return 'RESONATOR';
    if (type.includes('spell') || type.includes('chant')) return 'SPELL';
    if (type.includes('addition')) return 'ADDITION';
    if (type.includes('regalia')) return 'REGALIA';
    if (type.includes('instant')) return 'INSTANT';
    return 'RESONATOR'; // Default
  };

  // Map Force of Will rarity to our Rarity enum
  const mapRarity = (fowRarity: string): string => {
    const rarity = fowRarity.toLowerCase();
    if (rarity === 'c') return 'COMMON';
    if (rarity === 'u') return 'UNCOMMON';
    if (rarity === 'r') return 'RARE';
    if (rarity === 'sr') return 'SUPER_RARE';
    if (rarity === 'mr') return 'MYTHIC_RARE';
    if (rarity === 'jr') return 'RARE'; // J-Ruler rarity
    if (rarity === 'rr') return 'SUPER_RARE'; // Ruler rarity
    return 'COMMON'; // Default
  };

  return {
    id: fowCard.id,
    name: fowCard.name,
    type: mapType(fowCard.type[0] || 'resonator'),
    cost: fowCard.cost ? parseInt(fowCard.cost.replace(/[{}]/g, '')) || 0 : 0,
    power: typeof fowCard.ATK === 'number' ? fowCard.ATK : undefined,
    defense: typeof fowCard.DEF === 'number' ? fowCard.DEF : undefined,
    text: fowCard.abilities?.join('\n') || fowCard.flavour || '',
    imageUrl: undefined, // We'll add this later if needed
    rarity: mapRarity(fowCard.rarity),
    set: fowCard.id.split('-')[0] || 'UNKNOWN',
    cardNumber: fowCard.id.split('-')[1] || '000',
    // Additional Force of Will specific properties
    race: fowCard.race || [],
    colour: fowCard.colour || [],
    divinity: fowCard.divinity,
    flavour: fowCard.flavour,
    artists: fowCard.artists || [],
  };
}

// Create a sample deck from Force of Will cards
export function createSampleDeck(): any[] {
  const allCards = getAllCards();
  const resonators = allCards.filter(card => 
    card.type.some(t => t.toLowerCase().includes('resonator'))
  );
  const spells = allCards.filter(card => 
    card.type.some(t => t.toLowerCase().includes('spell') || t.toLowerCase().includes('chant'))
  );
  const rulers = allCards.filter(card => 
    card.type.some(t => t.toLowerCase().includes('ruler'))
  );

  // Create a balanced deck
  const deck = [
    ...rulers.slice(0, 1).map(convertToGameCard), // 1 Ruler
    ...resonators.slice(0, 20).map(convertToGameCard), // 20 Resonators
    ...spells.slice(0, 19).map(convertToGameCard), // 19 Spells
  ];

  return deck;
}
