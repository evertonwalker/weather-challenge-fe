import { computed, inject, ref } from 'vue'
import { defineStore } from 'pinia'

import type { WeatherForecastResponseDto } from '@/domain/contracts/weatherForecastResponse.dto'
import type { SmallCardWeather } from '@/domain/models/SmallCardWeather'
import type { Day } from '@/domain/models/Day'
import {
  getResolvedLocationName,
  mapWeatherResponseToCurrentDay,
  mapWeatherResponseToNextDays,
  mapWeatherResponseToSmallCards,
} from '@/application/mappers/weatherViewMapper'
import { getWeatherByPlaceUseCaseKey } from '@/core/di/injectionKeys'

export const useWeatherStore = defineStore('weather', () => {
  const getWeatherByPlaceUseCase = inject(getWeatherByPlaceUseCaseKey)
  if (!getWeatherByPlaceUseCase) {
    throw new Error(
      'GetWeatherByPlaceUseCase is not provided. Wire it in main.ts with app.provide(...).',
    )
  }

  /** Raw API payload — kept inside the store; not exposed to the UI. */
  const weatherResponse = ref<WeatherForecastResponseDto | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const selectedPlace = ref<string | null>(null)

  const hasWeatherData = computed(() => weatherResponse.value !== null)

  const resolvedLocationName = computed(() => getResolvedLocationName(weatherResponse.value))

  const currentDayWeather = computed<Day>(() =>
    mapWeatherResponseToCurrentDay(weatherResponse.value, selectedPlace.value),
  )

  const smallCardWeatherList = computed<SmallCardWeather[]>(() =>
    mapWeatherResponseToSmallCards(weatherResponse.value),
  )

  const nextDaysWeather = computed<Day[]>(() => mapWeatherResponseToNextDays(weatherResponse.value))

  const fetchWeatherByPlace = async (place: string) => {
    isLoading.value = true
    errorMessage.value = null
    selectedPlace.value = place

    try {
      weatherResponse.value = await getWeatherByPlaceUseCase.execute(place)
    } catch (error) {
      weatherResponse.value = null
      errorMessage.value =
        error instanceof Error ? error.message : 'Unexpected error while fetching weather'
    } finally {
      isLoading.value = false
    }
  }

  return {
    hasWeatherData,
    resolvedLocationName,
    currentDayWeather,
    nextDaysWeather,
    smallCardWeatherList,
    isLoading,
    errorMessage,
    selectedPlace,
    fetchWeatherByPlace,
  }
})
