import { Habit } from '../types/Habit'
import { FiEdit2, FiCheck } from 'react-icons/fi'

function getContrastColor(hexcolor: string): string {
  // Remove o # se existir
  const hex = hexcolor.replace('#', '')
  
  // Converte para RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calcula a luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Retorna branco para cores escuras e preto para cores claras
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  completed: boolean
  onToggleComplete: () => void
}

export function HabitCard({ habit, onEdit, completed, onToggleComplete }: HabitCardProps) {
  const textColor = getContrastColor(habit.color)
  
  return (
    <div 
      className={`py-2 px-4 rounded-lg flex justify-between items-center ${completed ? 'opacity-10' : ''}`}
      style={{ 
        backgroundColor: habit.color,
        color: textColor
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleComplete}
          className={`p-1 rounded-full hover:bg-black/20 ${completed ? 'opacity-100' : 'opacity-80'}`}
          style={{ color: textColor }}
          disabled={completed} // Disable button if completed is true
        >
          <FiCheck size={16} className={completed ? 'opacity-100' : 'opacity-80'} />
        </button>
        <div>
          <h3 className="font-semibold leading-tight">{habit.name}</h3>
          {habit.description && (
            <p 
              className="text-xs mt-0.5 opacity-90"
              style={{ color: textColor }}
            >
              {habit.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="px-2 py-1 rounded-md text-sm font-medium"
          style={{ 
            backgroundColor: `${textColor}20`,
            color: textColor
          }}
        >
          {habit.totalCompletions ?? 0}
        </div>
        <button
          onClick={() => onEdit(habit)}
          className="p-1 rounded-full hover:bg-black/20"
          style={{ color: textColor }}
        >
          <FiEdit2 size={16} />
        </button>
      </div>
    </div>
  )
} 