import { Habit } from '../types/habits';

export class HabitValidator {
  static toggleCompletion(habit: Habit): Habit {
    const today = new Date().toISOString().split('T')[0];
    const alreadyCompletedToday = habit.completedDates.includes(today);

    if (!alreadyCompletedToday) {
      // Adiciona a data de hoje apenas se ainda não estiver presente
      habit.completedDates.push(today);
    }

    return { ...habit, completedDates: [...habit.completedDates] };
  }

  static getCompletionCount(habit: Habit): number {
    // Retorna o número de dias únicos em que o hábito foi completado
    return new Set(habit.completedDates).size;
  }
} 