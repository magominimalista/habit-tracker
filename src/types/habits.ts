export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // Array de datas no formato ISO
  // ... outros campos existentes
} 