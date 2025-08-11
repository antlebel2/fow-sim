'use client';

import { useDroppable } from '@dnd-kit/core';

export default function TestDropZone() {
  const { setNodeRef, isOver, active } = useDroppable({
    id: 'test-drop-zone',
  });

  return (
    <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
      <h3 className="text-sm font-semibold text-red-700 mb-2">Test Drop Zone</h3>
      <div
        ref={setNodeRef}
        className={`
          h-20 bg-red-200 border-2 border-dashed rounded flex items-center justify-center transition-all duration-200
          ${isOver ? 'border-green-500 bg-green-200 scale-105' : 'border-red-400'}
          ${active ? 'border-yellow-500 bg-yellow-200' : ''}
        `}
      >
        <span className="text-red-600 text-xs">
          {isOver ? 'Drop here!' : 'Try dropping a card here'}
        </span>
      </div>
    </div>
  );
}
