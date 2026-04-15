import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { WeatherResponse } from '@/domain/models/Weather'
import { WeatherApi } from '@/infrastructure/http/WeatherApi'
import { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'
import type { CardWeather } from '@/domain/models/CardWeather'
import { defaultCardWeather } from '@/domain/models/CardWeather'

const weatherApi = new WeatherApi()
const getWeatherByPlaceUseCase = new GetWeatherByPlaceUseCase(weatherApi)

const getWeatherBackgroundColor = (conditionCode?: number): string => {
  if (!conditionCode) {
    return '#C3E0FB'
  }

  // WeatherAPI condition codes: https://www.weatherapi.com/docs/weather_conditions.json
  if (conditionCode === 1000) {
    return '#E4F0FE' // clear / sunny
  }

  if ([1003, 1006, 1009, 1030].includes(conditionCode)) {
    return '#C3E0FB' // cloudy / mist
  }

  if (
    (conditionCode >= 1063 && conditionCode <= 1201) ||
    conditionCode === 1240 ||
    conditionCode === 1243
  ) {
    return '#CDF0EB' // rainy
  }

  if (
    (conditionCode >= 1210 && conditionCode <= 1237) ||
    [1246, 1249, 1252].includes(conditionCode)
  ) {
    return '#FFF4DA' // snow / sleet
  }

  return '#FDD4D7' // thunder / severe weather fallback
}

export const useWeatherStore = defineStore('weather', () => {
  const weather = ref<WeatherResponse | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const selectedPlace = ref<string | null>(null)

  const cardWeather = computed<CardWeather>(() => {
    const weatherData = weather.value

    if (!weatherData) {
      return defaultCardWeather
    }

    const iconUrl = weatherData.current.condition.icon.startsWith('//')
      ? `https:${weatherData.current.condition.icon}`
      : weatherData.current.condition.icon

    const backgroundColor = getWeatherBackgroundColor(weatherData.current.condition.code)

    return {
      placeName: selectedPlace.value || weatherData.location.name || '',
      temperatureC: weatherData.current.temp_c || 0,
      conditionText: weatherData.current.condition.text || '',
      conditionIconUrl: iconUrl,
      backgroundColor,
      backgroundIcon: backgroundColor,
      backgroundColorWithOpacity: backgroundColor,
    }
  })

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
    cardWeather,
    isLoading,
    errorMessage,
    selectedPlace,
    fetchWeatherByPlace,
  }
})
