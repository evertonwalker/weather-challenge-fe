import type { WeatherResponse } from '@/domain/models/Weather'

export interface WeatherForecastRepository {
  getForecastByPlace(place: string): Promise<WeatherResponse>
}
