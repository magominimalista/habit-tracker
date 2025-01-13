import { useState } from 'react'
import { FiTrash2, FiEdit2 } from 'react-icons/fi'

interface SettingsModalProps {
  nickname: string
  onClose: () => void
  onUpdateNickname: (newNickname: string) => void
  onClearData: () => void
}

export function SettingsModal({ 
  nickname, 
  onClose, 
  onUpdateNickname, 
  onClearData 
}: SettingsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newNickname, setNewNickname] = useState(nickname)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNickname.trim().length >= 2) {
      onUpdateNickname(newNickname)
      setIsEditing(false)
    }
  }

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      onClearData()
      onClose()
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 z-overlay transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-modal p-4">
        <div 
          className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-6">Configurações</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Nome</span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
                    minLength={2}
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Salvar
                  </button>
                </form>
              ) : (
                <p className="font-medium">{nickname}</p>
              )}
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Limpar dados</h3>
                  <p className="text-gray-400 text-sm">
                    Remove todos os hábitos e estatísticas
                  </p>
                </div>
                <button
                  onClick={handleClearData}
                  className="text-red-500 hover:text-red-400"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 