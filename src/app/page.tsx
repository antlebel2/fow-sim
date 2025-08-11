import DndProvider from '../components/DndProvider';
import GameBoard from '../components/GameBoard';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
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

      {/* Game Board */}
      <DndProvider>
        <GameBoard />
      </DndProvider>
    </div>
  );
}
