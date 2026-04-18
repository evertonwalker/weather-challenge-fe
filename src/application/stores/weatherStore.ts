import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { WeatherResponse } from '@/domain/models/Weather'
import { WeatherApi } from '@/infrastructure/http/WeatherApi'
import { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'
import type { SmallCardWeather } from '@/domain/models/SmallCardWeather'
import type { Day } from '@/domain/models/Day'
import {
  getResolvedLocationName,
  mapWeatherResponseToCurrentDay,
  mapWeatherResponseToNextDays,
  mapWeatherResponseToSmallCards,
} from '@/application/mappers/weatherViewMapper'

const weatherApi = new WeatherApi()
const getWeatherByPlaceUseCase = new GetWeatherByPlaceUseCase(weatherApi)

export const useWeatherStore = defineStore('weather', () => {
  /** Raw API payload — kept inside the store; not exposed to the UI. */
  const weatherResponse = ref<WeatherResponse | null>(null)
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
