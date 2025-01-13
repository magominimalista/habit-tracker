import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface Weather {
  city: string
  temperature: number
  description: string
  icon: string
}

export class WeatherService {
  static async getWeather(lat: number, lon: number): Promise<Weather> {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      )

      return {
        city: response.data.name,
        temperature: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      }
    } catch (error) {
      throw new Error('Erro ao obter dados do clima')
    }
  }
} 