'use client';

export default function Instructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold text-blue-800 mb-2">How to Use Drag & Drop</h3>
      <div className="text-sm text-blue-700 space-y-1">
        <p>• <strong>Draw cards first:</strong> Click "Draw 5 Cards" to get cards in your hand</p>
        <p>• <strong>Drag from hand to field:</strong> Click and drag cards from your hand to the field zone</p>
        <p>• <strong>Drag to graveyard:</strong> Drag cards to the graveyard to discard/destroy them</p>
        <p>• <strong>Visual feedback:</strong> Drop zones will highlight when you drag over them</p>
        <p>• <strong>Check console:</strong> Open browser dev tools to see drag events</p>
      </div>
    </div>
  );
}
