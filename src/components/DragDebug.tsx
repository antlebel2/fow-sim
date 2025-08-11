'use client';

import { useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';

export default function DragDebug() {
  const [dragInfo, setDragInfo] = useState<any>(null);

  useDndMonitor({
    onDragStart: (event) => {
      console.log('DndMonitor - Drag started:', event);
      setDragInfo({
        type: 'start',
        active: event.active,
        timestamp: Date.now(),
      });
    },
    onDragOver: (event) => {
      console.log('DndMonitor - Drag over:', event);
      setDragInfo({
        type: 'over',
        active: event.active,
        over: event.over,
        timestamp: Date.now(),
      });
    },
    onDragEnd: (event) => {
      console.log('DndMonitor - Drag end:', event);
      setDragInfo({
        type: 'end',
        active: event.active,
        over: event.over,
        timestamp: Date.now(),
      });
    },
  });

  if (!dragInfo) return null;

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Drag Debug</h3>
      <div className="space-y-1">
        <p><strong>Type:</strong> {dragInfo.type}</p>
        <p><strong>Active ID:</strong> {dragInfo.active?.id}</p>
        {dragInfo.over && (
          <p><strong>Over ID:</strong> {dragInfo.over?.id}</p>
        )}
        <p><strong>Time:</strong> {new Date(dragInfo.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
