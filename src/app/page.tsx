import DndProvider from '../components/DndProvider';
import GameBoard from '../components/GameBoard';

export default function Home() {
  return (
    <DndProvider>
      <GameBoard />
    </DndProvider>
  );
}
