import { createContext, useState, ReactNode, useEffect } from 'react';
import { Habit } from '../types/habits';

interface HabitsContextData {
  habits: Habit[];
  createHabit: (name: string) => void;
  updateHabit: (habit: Habit) => void;
}

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsContext = createContext({} as HabitsContextData);

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [habits, setHabits] = useState<Habit[]>([]);

  const createHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      completedDates: []
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
  };

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  return (
    <HabitsContext.Provider value={{ habits, createHabit, updateHabit }}>
      {children}
    </HabitsContext.Provider>
  );
} 