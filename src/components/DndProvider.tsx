'use client';

import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { useState } from 'react';
import Card from './Card';
import DragDebug from './DragDebug';

interface DndProviderProps {
  children: React.ReactNode;
}

export default function DndProvider({ children }: DndProviderProps) {
  const { moveCard, playCard } = useGameStore();
  const [activeCard, setActiveCard] = useState<any>(null);
  
  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start dragging after 8px of movement
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event);
    const { active } = event;
    const cardData = active.data.current;
    setActiveCard(cardData);
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log('Drag over:', event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);
    
    console.log('Drag end event:', { active, over });
    
    if (!over) {
      console.log('Drag ended without dropping on a valid target');
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('Drag end:', { activeId, overId });

    // Parse the IDs to extract player and zone information
    // Handle card IDs that might contain hyphens (like "resonator-2")
    const activeIdParts = activeId.split('-');
    const activePlayerId = activeIdParts[0];
    const activeZone = activeIdParts[1];
    const cardId = activeIdParts.slice(2).join('-'); // Join remaining parts as card ID
    
    // Handle special test drop zone (which has a different ID format)
    if (overId === 'test-drop-zone') {
      console.log('Card dropped in test zone - moving to graveyard');
      if (!activePlayerId || !activeZone || !cardId) {
        console.log('Invalid active drag ID:', { activeId, activePlayerId, activeZone, cardId });
        return;
      }
      moveCard(activePlayerId, cardId, activeZone, 'graveyard');
      return;
    }
    
    // Parse regular game zone IDs
    const [overPlayerId, overZone] = overId.split('-');

    console.log('Parsed:', { activePlayerId, activeZone, cardId, overPlayerId, overZone });

    // Validate that we have all the required parts
    if (!activePlayerId || !activeZone || !cardId || !overPlayerId || !overZone) {
      console.log('Invalid drag IDs:', { activeId, overId });
      return;
    }

    if (activePlayerId === overPlayerId && activeZone === overZone) {
      console.log('Same zone, no action needed');
      return; // Same zone, no action needed
    }

    try {
      // Handle card movement based on zone types
      if (activeZone === 'hand' && overZone === 'field') {
        // Playing a card from hand to field
        console.log('Playing card from hand to field');
        playCard(activePlayerId, cardId, 'field');
      } else if (activeZone === 'hand' && overZone === 'graveyard') {
        // Discarding a card from hand
        console.log('Discarding card from hand');
        moveCard(activePlayerId, cardId, 'hand', 'graveyard');
      } else if (activeZone === 'field' && overZone === 'graveyard') {
        // Destroying a card from field
        console.log('Destroying card from field');
        moveCard(activePlayerId, cardId, 'field', 'graveyard');
      } else if (activeZone === 'deck' && overZone === 'hand') {
        // Drawing a card (this should be handled by draw button, but just in case)
        console.log('Drawing card from deck');
        moveCard(activePlayerId, cardId, 'deck', 'hand');
      } else {
        // Generic card movement
        console.log('Moving card between zones');
        moveCard(activePlayerId, cardId, activeZone, overZone);
      }
    } catch (error) {
      console.error('Error during card movement:', error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeCard ? (
          <Card
            card={activeCard.card}
            zone={activeCard.zone}
            playerId={activeCard.playerId}
            className="w-24 h-32 opacity-80"
          />
        ) : null}
      </DragOverlay>
      <DragDebug />
    </DndContext>
  );
}
