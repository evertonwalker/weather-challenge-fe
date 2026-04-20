import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from '@/core/config/weatherApi'
import type { WeatherForecastResponseDto } from '@/domain/contracts/weatherForecastResponse.dto'
import type { WeatherForecastRepository } from '@/domain/ports/WeatherForecastRepository'

export class WeatherApi implements WeatherForecastRepository {
  async getForecastByPlace(place: string): Promise<WeatherForecastResponseDto> {
    const url = new URL(`${WEATHER_API_BASE_URL}/forecast.json`)
    url.searchParams.set('key', WEATHER_API_KEY)
    url.searchParams.set('q', place)
    url.searchParams.set('days', '3')
    url.searchParams.set('lang', 'en')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    return (await response.json()) as WeatherForecastResponseDto
  }
}
