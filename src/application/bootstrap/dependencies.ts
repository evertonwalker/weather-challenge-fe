import { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'
import type { SavedPlacesRepository } from '@/domain/ports/SavedPlacesRepository'
import type { WeatherForecastRepository } from '@/domain/ports/WeatherForecastRepository'
import { SavedPlacesLocalStorageRepository } from '@/infrastructure/persistence/SavedPlacesLocalStorageRepository'
import { WeatherApi } from '@/infrastructure/http/WeatherApi'

/** Composition root: instancia portas concretas e casos de uso (único lugar que importa infraestrutura aqui). */
export function createWeatherDependencies() {
  const weatherForecastRepository: WeatherForecastRepository = new WeatherApi()
  const getWeatherByPlaceUseCase = new GetWeatherByPlaceUseCase(weatherForecastRepository)
  const savedPlacesRepository: SavedPlacesRepository = new SavedPlacesLocalStorageRepository()
  return { getWeatherByPlaceUseCase, savedPlacesRepository }
}
