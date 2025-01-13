import { useState } from 'react'
import { z } from 'zod'
import { StorageService } from '../services/StorageService'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'

const nicknameSchema = z.string().min(2, 'Apelido deve ter pelo menos 2 caracteres')

interface LocationStatus {
  status: 'idle' | 'loading' | 'success' | 'error'
  message?: string
}

export function NicknameModal({ onComplete }: { onComplete: () => void }) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({ status: 'idle' })

  const requestLocation = () => {
    setLocationStatus({ status: 'loading' })

    if (!navigator.geolocation) {
      setLocationStatus({ 
        status: 'error', 
        message: 'Geolocalização não é suportada pelo seu navegador' 
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        StorageService.saveLocation({ latitude, longitude })
        setLocationStatus({ 
          status: 'success', 
          message: 'Localização salva com sucesso!' 
        })
      },
      () => {
        setLocationStatus({ 
          status: 'error', 
          message: 'Não foi possível obter sua localização' 
        })
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      nicknameSchema.parse(nickname)
      StorageService.setNickname(nickname)
      onComplete()
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-overlay" />
      <div className="fixed inset-0 flex items-center justify-center z-modal p-4">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md text-white shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Tracker de Hábitos</h2>
            <p className="text-gray-400">
              Vamos personalizar sua experiência para melhor atender suas necessidades
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Como podemos te chamar?
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Digite seu nome ou apelido"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Localização para previsão do tempo
                </label>
                <span className="text-xs text-gray-400">(Opcional)</span>
              </div>
              
              <button
                type="button"
                onClick={requestLocation}
                disabled={locationStatus.status === 'loading'}
                className={`
                  w-full flex items-center justify-center gap-2 p-3 rounded-lg
                  border border-gray-600 text-sm font-medium
                  ${locationStatus.status === 'success' 
                    ? 'bg-green-600/20 border-green-500/50 text-green-400' 
                    : 'bg-gray-700 hover:bg-gray-600/50'
                  }
                `}
              >
                <FiMapPin size={18} />
                {locationStatus.status === 'loading' && 'Obtendo localização...'}
                {locationStatus.status === 'success' && 'Localização salva'}
                {locationStatus.status === 'error' && 'Tentar novamente'}
                {locationStatus.status === 'idle' && 'Permitir acesso à localização'}
              </button>
              
              {locationStatus.message && (
                <p className={`text-sm mt-1 ${
                  locationStatus.status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {locationStatus.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 flex items-center justify-center gap-2 font-medium"
            >
              Salvar e continuar
              <FiArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
} 