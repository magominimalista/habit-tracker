import { Habit } from '../types/Habit';
import { FiBell } from 'react-icons/fi';

interface RemainingHabitsWidgetProps {
  habits: Habit[];
  completedHabits: Set<string>;
}

export function RemainingHabitsWidget({ habits, completedHabits }: RemainingHabitsWidgetProps) {
  const remainingHabitsCount = habits.length - completedHabits.size;

  return (
    <div className="bg-gray-800/50 
      rounded-lg backdrop-blur-sm p-3 text-white shadow-md w-64">
      {remainingHabitsCount > 0 ? (
        <div className="flex items-center gap-2">
            <FiBell className="text-lg" />
            <p className="text-sm">
                Você ainda possui <span className="font-bold">{remainingHabitsCount}</span> hábitos para hoje.
            </p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FiBell className="text-lg" />
          <p className="text-sm">Sua lista de hábitos<br></br> está limpa.</p>
        </div>
      )}
    </div>
  );
} 