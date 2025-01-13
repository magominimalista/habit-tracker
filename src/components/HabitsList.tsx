import { Habit } from '../types/Habit'
import { HabitCard } from './HabitCard'
import { motion, AnimatePresence } from 'framer-motion'

interface HabitsListProps {
  habits: Habit[]
  completedHabits: Set<string>
  onToggleComplete: (id: string) => void
  onEditHabit: (habit: Habit) => void
  showProgress?: boolean
}

export function HabitsList({ 
  habits, 
  completedHabits, 
  onToggleComplete, 
  onEditHabit,
  showProgress = true 
}: HabitsListProps) {
  const completedCount = completedHabits.size
  const totalHabits = habits.length
  const progress = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300">
          Você ainda não tem hábitos cadastrados.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showProgress && (
        <div className="mb-6">
          <div className="w-1/4 h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm">
            <span className="font-bold text-blue-500">{completedCount}</span>
            {' '}de{' '}
            <span className="font-bold text-blue-500">{totalHabits}</span>
            {' '}hábitos completados hoje
          </p>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completed={completedHabits.has(habit.id)}
              onToggleComplete={() => onToggleComplete(habit.id)}
              onEdit={() => onEditHabit(habit)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 