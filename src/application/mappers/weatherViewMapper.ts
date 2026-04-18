import type { Day } from '@/domain/models/Day'
import { defaultDay } from '@/domain/models/Day'
import type { SmallCardWeather } from '@/domain/models/SmallCardWeather'
import type { WeatherResponse } from '@/domain/models/Weather'

/**
 * Maps WeatherAPI condition codes to UI background colors.
 * @see https://www.weatherapi.com/docs/weather_conditions.json
 */
export function getWeatherBackgroundColor(conditionCode?: number): string {
  if (!conditionCode) {
    return '#C3E0FB'
  }

  if (conditionCode === 1000) {
    return '#E4F0FE'
  }

  if ([1003, 1006, 1009, 1030].includes(conditionCode)) {
    return '#C3E0FB'
  }

  if (
    (conditionCode >= 1063 && conditionCode <= 1201) ||
    conditionCode === 1240 ||
    conditionCode === 1243
  ) {
    return '#CDF0EB'
  }

  if (
    (conditionCode >= 1210 && conditionCode <= 1237) ||
    [1246, 1249, 1252].includes(conditionCode)
  ) {
    return '#FFF4DA'
  }

  return '#FDD4D7'
}

function getForecastDayLabel(date: string, index: number): string {
  if (index === 0) {
    return 'Today'
  }
  if (index === 1) {
    return 'Tomorrow'
  }

  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
}

export function mapWeatherResponseToCurrentDay(
  weather: WeatherResponse | null,
  selectedPlace: string | null,
): Day {
  if (!weather) {
    return defaultDay
  }

  const backgroundColor = getWeatherBackgroundColor(weather.current.condition.code)

  return {
    name: selectedPlace || weather.location.name || '',
    temperatureC: weather.current.temp_c || 0,
    iconUrl: weather.current.condition.icon || '',
    backgroundColor,
    conditionText: weather.current.condition.text || '',
  }
}

/**
 * @param currentLocalHour — hour 0–23 in the user's local timezone; defaults to `new Date().getHours()`.
 * Pass a fixed value in unit tests.
 */
export function mapWeatherResponseToSmallCards(
  weather: WeatherResponse | null,
  currentLocalHour: number = new Date().getHours(),
): SmallCardWeather[] {
  if (!weather) {
    return []
  }

  const hourlyForecast = weather.forecast.forecastday.flatMap((forecastDay) => forecastDay.hour)
  if (hourlyForecast.length === 0) {
    return []
  }

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
}

export function mapWeatherResponseToNextDays(weather: WeatherResponse | null): Day[] {
  if (!weather) {
    return []
  }

  return weather.forecast.forecastday.map((forecastDay, index) => ({
    name: getForecastDayLabel(forecastDay.date, index),
    temperatureC: forecastDay.day.avgtemp_c,
    iconUrl: forecastDay.day.condition.icon,
    backgroundColor: getWeatherBackgroundColor(forecastDay.day.condition.code),
    conditionText: forecastDay.day.condition.text || '',
  }))
}
