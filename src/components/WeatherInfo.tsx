import { useState, useEffect } from 'react'
import { WeatherService, Weather } from '../services/WeatherService'
import { StorageService } from '../services/StorageService'
import {
  UilCloud,
  UilSun,
  UilCloudSun,
  UilCloudMoon,
  UilMoon,
  UilThunderstorm,
  UilRaindrops,
  UilSnowflake,
} from '@iconscout/react-unicons'

interface WeatherInfoProps {
  className?: string
}

const getWeatherIcon = (iconCode: string) => {
  const hour = new Date().getHours()
  const isNight = hour < 6 || hour > 18

  switch (iconCode.slice(0, 2)) {
    case '01': return isNight ? <UilMoon /> : <UilSun />
    case '02': return isNight ? <UilCloudMoon /> : <UilCloudSun />
    case '03':
    case '04': return <UilCloud />
    case '09':
    case '10': return <UilRaindrops />
    case '11': return <UilThunderstorm />
    case '13': return <UilSnowflake />
    default: return <UilCloud />
  }
}

export function WeatherInfo({ className = '' }: WeatherInfoProps) {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      const location = StorageService.getLocation()
      if (!location) return

      try {
        const weatherData = await WeatherService.getWeather(
          location.latitude,
          location.longitude
        )
        setWeather(weatherData)
      } catch (err) {
        setError('Não foi possível obter dados do clima')
      }
    }

    fetchWeather()
    // Atualiza a cada 30 minutos
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (error || !weather) return null

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 bg-gray-800/50 
      rounded-lg border border-gray-700/50 backdrop-blur-sm
      ${className}
    `}>
      <div className="text-3xl text-gray-200">
        {getWeatherIcon(weather.icon)}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-200">{weather.city}</p>
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-lg font-semibold">{weather.temperature}°C</span>
          <span className="text-sm">•</span>
          <span className="text-sm">{weather.description}</span>
        </div>
      </div>
    </div>
  )
} 