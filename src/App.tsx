import { useEffect, useState } from 'react'
import { NicknameModal } from './components/NicknameModal'
import { StorageService } from './services/StorageService'
import { getGreeting } from './utils/dateUtils'
import { Habit } from './types/Habit'
import { v4 as uuidv4 } from 'uuid'
import { HabitModal } from './components/HabitModal'
import { TabButton } from './components/TabButton'
import { HabitsList } from './components/HabitsList'
import { FiSettings } from 'react-icons/fi'
import { SettingsModal } from './components/SettingsModal'
import { startOfDay } from 'date-fns'
import { WeatherInfo } from './components/WeatherInfo'
import { RemainingHabitsWidget } from './components/RemainingHabitsWidget'
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal'

function App() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null)
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'all'>('today')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null)

  useEffect(() => {
    const savedNickname = StorageService.getNickname()
    const savedHabits = StorageService.getHabits()
    const todayCompletions = StorageService.getTodayCompletions()
    
    setHabits(savedHabits)
    setCompletedHabits(todayCompletions)
    
    if (!savedNickname) {
      setShowNicknameModal(true)
    } else {
      setNickname(savedNickname)
    }
  }, [])

  const handleNicknameComplete = () => {
    setShowNicknameModal(false)
    setNickname(StorageService.getNickname())
  }

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      id: uuidv4(),
      createdAt: new Date(),
      ...habitData,
      totalCompletions: 0
    }

    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)
    StorageService.saveHabits(updatedHabits)
  }

  const handleEditHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!habitToEdit) return

    const updatedHabit: Habit = {
      ...habitToEdit,
      ...habitData
    }

    const updatedHabits = habits.map(h => 
      h.id === habitToEdit.id ? updatedHabit : h
    )
    
    setHabits(updatedHabits)
    StorageService.saveHabits(updatedHabits)
    setHabitToEdit(null)
  }

  const handleDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit)
  }

  const confirmDelete = () => {
    if (!habitToDelete) return

    // Remove o hábito da lista
    const updatedHabits = habits.filter(h => h.id !== habitToDelete.id)
    setHabits(updatedHabits)
    StorageService.saveHabits(updatedHabits)

    // Remove todas as conclusões do hábito
    const completions = StorageService.getCompletions()
    const updatedCompletions = completions.filter(c => c.habitId !== habitToDelete.id)
    StorageService.saveCompletions(updatedCompletions)

    // Remove do set de hábitos completados hoje
    const newCompleted = new Set(completedHabits)
    newCompleted.delete(habitToDelete.id)
    setCompletedHabits(newCompleted)

    // Fecha o modal de edição se estiver aberto
    setShowHabitModal(false)
    setHabitToEdit(null)
    
    // Limpa o hábito a ser deletado
    setHabitToDelete(null)
  }

  const toggleHabitComplete = (habitId: string) => {
    const today = startOfDay(new Date()).toISOString()
    const completions = StorageService.getCompletions()
    const newCompleted = new Set(completedHabits)
    const isCompleting = !newCompleted.has(habitId)
    
    if (isCompleting) {
      // Verifica se já foi completado hoje
      const completedToday = completions.some(c => 
        c.habitId === habitId && 
        startOfDay(new Date(c.date)).toISOString() === today
      )

      if (!completedToday) {
        // Adiciona nova conclusão
        completions.push({
          habitId,
          date: new Date().toISOString()
        })
        StorageService.saveCompletions(completions)

        // Atualiza contador total do hábito
        const updatedHabits = habits.map(h => {
          if (h.id === habitId) {
            return {
              ...h,
              totalCompletions: (h.totalCompletions || 0) + 1
            }
          }
          return h
        })
        setHabits(updatedHabits)
        StorageService.saveHabits(updatedHabits)

        // Atualiza estado de conclusões do dia
        newCompleted.add(habitId)
      }
    } else {
      // Remove conclusão do dia
      const updatedCompletions = completions.filter(c => 
        !(c.habitId === habitId && 
          startOfDay(new Date(c.date)).toISOString() === today)
      )
      StorageService.saveCompletions(updatedCompletions)
      newCompleted.delete(habitId)
    }
    
    setCompletedHabits(newCompleted)
  }

  const handleUpdateNickname = (newNickname: string) => {
    StorageService.setNickname(newNickname)
    setNickname(newNickname)
  }

  const handleClearData = () => {
    StorageService.clearAll()
    setHabits([])
    setCompletedHabits(new Set())
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {showNicknameModal && (
        <NicknameModal onComplete={handleNicknameComplete} />
      )}

      {habitToDelete && (
        <DeleteConfirmationModal
          habitName={habitToDelete.name}
          onConfirm={confirmDelete}
          onCancel={() => setHabitToDelete(null)}
        />
      )}

      {showHabitModal && (
        <HabitModal
          habit={habitToEdit}
          onSave={habitToEdit ? handleEditHabit : addHabit}
          onDelete={handleDeleteHabit}
          onClose={() => {
            setShowHabitModal(false)
            setHabitToEdit(null)
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          nickname={nickname || ''}
          onClose={() => setShowSettingsModal(false)}
          onUpdateNickname={handleUpdateNickname}
          onClearData={handleClearData}
        />
      )}

      {nickname && (
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">
                  {getGreeting()}, {nickname}!
                </h1>
                <div className="flex gap-4">
                  <WeatherInfo />
                  <RemainingHabitsWidget habits={habits} completedHabits={completedHabits} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setShowHabitModal(true)}
                >
                  Adicionar Hábito
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <FiSettings size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <TabButton 
                active={activeTab === 'today'} 
                onClick={() => setActiveTab('today')}
              >
                Hoje
              </TabButton>
              <TabButton 
                active={activeTab === 'week'} 
                onClick={() => setActiveTab('week')}
              >
                Semana
              </TabButton>
              <TabButton 
                active={activeTab === 'all'} 
                onClick={() => setActiveTab('all')}
              >
                Tudo
              </TabButton>
            </div>
          </header>

          {activeTab === 'today' && (
            <HabitsList
              habits={habits}
              completedHabits={completedHabits}
              onToggleComplete={toggleHabitComplete}
              onEditHabit={(habit) => {
                setHabitToEdit(habit)
                setShowHabitModal(true)
              }}
            />
          )}
          
          {activeTab === 'week' && (
            <div className="text-center py-8">
              <p className="text-gray-400">Em desenvolvimento...</p>
            </div>
          )}
          
          {activeTab === 'all' && (
            <div className="text-center py-8">
              <p className="text-gray-400">Em desenvolvimento...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App 