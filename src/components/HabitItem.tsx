import { useContext } from 'react';
import { motion } from 'framer-motion';
import { HabitsContext } from '../contexts/HabitsContext';
import { Habit } from '../types/habits.ts';
import { StorageService } from '../services/StorageService';
import { HabitValidator } from '../utils/HabitValidator';

interface HabitItemProps {
  habit: Habit;
}

export function HabitItem({ habit }: HabitItemProps) {
  const { updateHabit } = useContext(HabitsContext);

  const handleToggleHabit = () => {
    const todayEntries = StorageService.getTodayEntries();

    if (!todayEntries.has(habit.id)) {
      const updatedHabit = HabitValidator.toggleCompletion(habit);
      updateHabit(updatedHabit);

      // Salva a entrada de hoje
      const newEntry = {
        id: crypto.randomUUID(),
        habitId: habit.id,
        date: new Date().toISOString(),
        completed: true
      };
      const entries = StorageService.getEntries();
      const parsedEntry = {
        ...newEntry,
        date: new Date(newEntry.date)
      };
      StorageService.saveEntries([...entries, parsedEntry]);
    }
  };

  const completedCount = HabitValidator.getCompletionCount(habit);

  return (
    <motion.div
      className="habit-item"
      initial={{ opacity: 1, height: 'auto' }}
      animate={{ opacity: StorageService.getTodayEntries().has(habit.id) ? 0 : 1, height: StorageService.getTodayEntries().has(habit.id) ? 0 : 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      style={{ overflow: 'hidden' }}
    >
      <input
        type="checkbox"
        checked={StorageService.getTodayEntries().has(habit.id)}
        onChange={handleToggleHabit}
      />
      <span>{habit.name}</span>
      <span className="count">{completedCount}</span>
    </motion.div>
  );
} 