import type { WeatherResponse } from '@/domain/models/Weather'
import { WeatherApi } from '@/infrastructure/http/WeatherApi'

export class GetWeatherByPlaceUseCase {
  constructor(private readonly weatherApi: WeatherApi) {}

  async execute(place: string): Promise<WeatherResponse> {
    return this.weatherApi.getForecastByPlace(place)
  }
}
