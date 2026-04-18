import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { WeatherResponse } from '@/domain/models/Weather'
import { WeatherApi } from '@/infrastructure/http/WeatherApi'
import { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'
import type { SmallCardWeather } from '@/domain/models/SmallCardWeather'
import type { Day } from '@/domain/models/Day'
import {
  mapWeatherResponseToCurrentDay,
  mapWeatherResponseToNextDays,
  mapWeatherResponseToSmallCards,
} from '@/application/mappers/weatherViewMapper'

const weatherApi = new WeatherApi()
const getWeatherByPlaceUseCase = new GetWeatherByPlaceUseCase(weatherApi)

export const useWeatherStore = defineStore('weather', () => {
  const weather = ref<WeatherResponse | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const selectedPlace = ref<string | null>(null)

  const currentDayWeather = computed<Day>(() =>
    mapWeatherResponseToCurrentDay(weather.value, selectedPlace.value),
  )

  const smallCardWeatherList = computed<SmallCardWeather[]>(() =>
    mapWeatherResponseToSmallCards(weather.value),
  )

  const nextDaysWeather = computed<Day[]>(() => mapWeatherResponseToNextDays(weather.value))

  const fetchWeatherByPlace = async (place: string) => {
    isLoading.value = true
    errorMessage.value = null
    selectedPlace.value = place

    try {
      weather.value = await getWeatherByPlaceUseCase.execute(place)
    } catch (error) {
      weather.value = null
      errorMessage.value =
        error instanceof Error ? error.message : 'Unexpected error while fetching weather'
    } finally {
      isLoading.value = false
    }
  }

  return {
    weather,
    currentDayWeather,
    nextDaysWeather,
    smallCardWeatherList,
    isLoading,
    errorMessage,
    selectedPlace,
    fetchWeatherByPlace,
  }
})
