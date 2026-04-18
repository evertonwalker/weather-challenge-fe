import type { WeatherResponse } from '@/domain/models/Weather'
import type { WeatherForecastRepository } from '@/domain/ports/WeatherForecastRepository'

export class GetWeatherByPlaceUseCase {
  constructor(private readonly weatherForecastRepository: WeatherForecastRepository) {}

  async execute(place: string): Promise<WeatherResponse> {
    return this.weatherForecastRepository.getForecastByPlace(place)
  }
}
