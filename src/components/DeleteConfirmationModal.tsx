import { Z_INDEX } from '../constants/zIndex'

interface DeleteConfirmationModalProps {
  onConfirm: () => void
  onCancel: () => void
  habitName: string
}

export function DeleteConfirmationModal({ 
  onConfirm, 
  onCancel,
  habitName 
}: DeleteConfirmationModalProps) {
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity"
        style={{ zIndex: Z_INDEX.DELETE_OVERLAY }}
        onClick={onCancel}
      />
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: Z_INDEX.DELETE_MODAL }}
      >
        <div 
          className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Excluir Hábito</h2>
          
          <p className="text-gray-300 mb-6">
            Tem certeza que deseja excluir o hábito "{habitName}"? 
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 