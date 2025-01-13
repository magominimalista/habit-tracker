import React from 'react';
import { useState } from 'react'
import { Habit } from '../types/Habit'
import { Z_INDEX } from '../constants/zIndex'
import { motion } from "framer-motion";

interface HabitModalProps {
  habit?: Habit | null
  onSave: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  onClose: () => void
  onDelete?: (habit: Habit) => void
}

export function HabitModal({ habit, onSave, onClose, onDelete }: HabitModalProps) {
  const [name, setName] = useState(habit?.name || '')
  const [description, setDescription] = useState(habit?.description || '')
  const [color, setColor] = useState(habit?.color || '#3B82F6')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, description, color, totalCompletions: 0 })
    onClose()
  }

  const handleDelete = () => {
    if (habit && onDelete) {
      onDelete(habit)
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity"
        style={{ zIndex: Z_INDEX.OVERLAY }}
        onClick={onClose}
      />
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: Z_INDEX.MODAL }}
      >

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          duration: 0.5,
          bounce: 0.3
        }}
      >

          <div 
            className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{habit ? 'Editar Hábito' : 'Novo Hábito'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Cor</label>
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer appearance-none bg-gray-700"
                    style={{
                      padding: 0,
                      border: '2px solid rgba(255,255,255,0.1)'
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{ 
                      backgroundColor: color,
                      border: '2px solid rgba(255,255,255,0.1)'
                    }} 
                  />
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <div>
                  {habit && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
          </motion.div>
        </div>
    </>
  )
} 