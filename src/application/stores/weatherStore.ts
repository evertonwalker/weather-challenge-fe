import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { WeatherResponse } from '@/domain/models/Weather'
import { WeatherApi } from '@/infrastructure/http/WeatherApi'
import { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'
import type { SmallCardWeather } from '@/domain/models/SmallCardWeather'
import { defaultDay, type Day } from '@/domain/models/Day'

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

const getNameDate = (date: string, index: number) => {
  if (index === 0) {
    return 'Today'
  }
  if (index === 1) {
    return 'Tomorrow'
  }

  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
}

export const useWeatherStore = defineStore('weather', () => {
  const weather = ref<WeatherResponse | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const selectedPlace = ref<string | null>(null)

  const currentDayWeather = computed<Day>(() => {
    const weatherData = weather.value

    if (!weatherData) {
      return defaultDay
    }
    const backgroundColor = getWeatherBackgroundColor(weatherData.current.condition.code)

    return {
      name: selectedPlace.value || weatherData.location.name || '',
      temperatureC: weatherData.current.temp_c || 0,
      iconUrl: weatherData.current.condition.icon || '',
      backgroundColor,
      conditionText: weatherData.current.condition.text || '',
    }
  })

  const smallCardWeatherList = computed<SmallCardWeather[]>(() => {
    const weatherData = weather.value

    if (!weatherData) {
      return []
    }

    const hourlyForecast = weatherData.forecast.forecastday.flatMap(
      (forecastDay) => forecastDay.hour,
    )
    if (hourlyForecast.length === 0) {
      return []
    }

    const currentLocalHour = new Date().getHours()
    const sortedHourlyForecast = [...hourlyForecast].sort((a, b) => a.time_epoch - b.time_epoch)
    const startIndex = sortedHourlyForecast.findIndex((hourData) => {
      const hourText = hourData.time.split(' ')[1] ?? '00:00'
      const hourValue = Number.parseInt(hourText.split(':')[0] ?? '0', 10)
      return hourValue >= currentLocalHour
    })

    const safeStartIndex = startIndex === -1 ? 0 : startIndex
    const nextHours = sortedHourlyForecast.slice(safeStartIndex, safeStartIndex + 5)

    return nextHours.map((hourData, index) => {
      const hourText = hourData.time.split(' ')[1] ?? ''
      const iconUrl = hourData.condition.icon.startsWith('//')
        ? `https:${hourData.condition.icon}`
        : hourData.condition.icon

      return {
        time: index === 0 ? 'Now' : hourText,
        iconUrl,
        backgroundColor: getWeatherBackgroundColor(hourData.condition.code),
        temperatureC: hourData.temp_c,
      }
    })
  })

  const nextDaysWeather = computed<Day[]>(() => {
    const weatherData = weather.value

    if (!weatherData) {
      return []
    }

    return weatherData.forecast.forecastday.map((forecastDay, index) => {
      return {
        name: getNameDate(forecastDay.date, index),
        temperatureC: forecastDay.day.avgtemp_c,
        iconUrl: forecastDay.day.condition.icon,
        backgroundColor: getWeatherBackgroundColor(forecastDay.day.condition.code),
        conditionText: forecastDay.day.condition.text || '',
      }
    })
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
    currentDayWeather,
    nextDaysWeather,
    smallCardWeatherList,
    isLoading,
    errorMessage,
    selectedPlace,
    fetchWeatherByPlace,
  }
})
