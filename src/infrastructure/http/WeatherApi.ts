import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from '@/core/config/weatherApi'
import type { WeatherResponse } from '@/domain/models/Weather'

export class WeatherApi {
  async getForecastByPlace(place: string): Promise<WeatherResponse> {
    const url = new URL(`${WEATHER_API_BASE_URL}/forecast.json`)
    url.searchParams.set('key', WEATHER_API_KEY)
    url.searchParams.set('q', place)
    url.searchParams.set('days', '3')
    url.searchParams.set('lang', 'pt')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    return (await response.json()) as WeatherResponse
  }
}
