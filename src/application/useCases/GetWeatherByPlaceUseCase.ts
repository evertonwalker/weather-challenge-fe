import type { WeatherForecastResponseDto } from '@/domain/contracts/weatherForecastResponse.dto'
import type { WeatherForecastRepository } from '@/domain/ports/WeatherForecastRepository'

export class GetWeatherByPlaceUseCase {
  constructor(private readonly weatherForecastRepository: WeatherForecastRepository) {}

  async execute(place: string): Promise<WeatherForecastResponseDto> {
    return this.weatherForecastRepository.getForecastByPlace(place)
  }
}
