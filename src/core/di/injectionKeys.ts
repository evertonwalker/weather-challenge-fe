import type { InjectionKey } from 'vue'

import type { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'
import type { SavedPlacesRepository } from '@/domain/ports/SavedPlacesRepository'

export const getWeatherByPlaceUseCaseKey: InjectionKey<GetWeatherByPlaceUseCase> = Symbol(
  'getWeatherByPlaceUseCase',
)

export const savedPlacesRepositoryKey: InjectionKey<SavedPlacesRepository> = Symbol(
  'savedPlacesRepository',
)
