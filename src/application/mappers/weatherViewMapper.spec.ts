import { describe, it, expect } from 'vitest'

import type { WeatherForecastResponseDto } from '@/domain/contracts/weatherForecastResponse.dto'
import { defaultDay } from '@/domain/models/Day'
import {
  getResolvedLocationName,
  getWeatherBackgroundColor,
  mapWeatherResponseToCurrentDay,
  mapWeatherResponseToNextDays,
  mapWeatherResponseToSmallCards,
} from '@/application/mappers/weatherViewMapper'

/** Only fields used by mappers — cast to full DTO for tests. */
function dto(partial: unknown): WeatherForecastResponseDto {
  return partial as WeatherForecastResponseDto
}

describe('getWeatherBackgroundColor', () => {
  it('returns default when code is missing', () => {
    expect(getWeatherBackgroundColor(undefined)).toBe('#C3E0FB')
  })

  it('maps clear/sunny (1000)', () => {
    expect(getWeatherBackgroundColor(1000)).toBe('#E4F0FE')
  })

  it('maps cloudy codes', () => {
    expect(getWeatherBackgroundColor(1003)).toBe('#C3E0FB')
  })

  it('maps rain range', () => {
    expect(getWeatherBackgroundColor(1063)).toBe('#CDF0EB')
    expect(getWeatherBackgroundColor(1240)).toBe('#CDF0EB')
  })

  it('maps snow range', () => {
    expect(getWeatherBackgroundColor(1210)).toBe('#FFF4DA')
    expect(getWeatherBackgroundColor(1252)).toBe('#FFF4DA')
  })

  it('falls back for unknown severe codes', () => {
    expect(getWeatherBackgroundColor(9999)).toBe('#FDD4D7')
  })
})

describe('getResolvedLocationName', () => {
  it('returns null when payload is null', () => {
    expect(getResolvedLocationName(null)).toBeNull()
  })

  it('trims location name', () => {
    const weather = dto({
      location: { name: '  Paris  ' },
    })
    expect(getResolvedLocationName(weather)).toBe('Paris')
  })
})

describe('mapWeatherResponseToCurrentDay', () => {
  it('returns defaultDay when weather is null', () => {
    expect(mapWeatherResponseToCurrentDay(null, null)).toEqual(defaultDay)
  })

  it('prefers selectedPlace over API name', () => {
    const weather = dto({
      location: { name: 'API Name' },
      current: {
        temp_c: 15,
        condition: { code: 1000, text: 'Clear', icon: '//icon' },
      },
    })
    const day = mapWeatherResponseToCurrentDay(weather, 'User Query')
    expect(day.name).toBe('User Query')
    expect(day.temperatureC).toBe(15)
    expect(day.backgroundColor).toBe('#E4F0FE')
    expect(day.conditionText).toBe('Clear')
  })

  it('uses API location when selectedPlace is null', () => {
    const weather = dto({
      location: { name: 'Tokyo' },
      current: {
        temp_c: 8,
        condition: { code: 1003, text: 'Cloudy', icon: 'icon' },
      },
    })
    const day = mapWeatherResponseToCurrentDay(weather, null)
    expect(day.name).toBe('Tokyo')
  })
})

describe('mapWeatherResponseToNextDays', () => {
  it('returns empty array when null', () => {
    expect(mapWeatherResponseToNextDays(null)).toEqual([])
  })

  it('labels first two days Today and Tomorrow', () => {
    const weather = dto({
      forecast: {
        forecastday: [
          {
            date: '2024-06-01',
            day: {
              avgtemp_c: 10,
              condition: { code: 1000, text: 'A', icon: 'i1' },
            },
          },
          {
            date: '2024-06-02',
            day: {
              avgtemp_c: 11,
              condition: { code: 1003, text: 'B', icon: 'i2' },
            },
          },
        ],
      },
    })
    const days = mapWeatherResponseToNextDays(weather)
    expect(days[0]?.name).toBe('Today')
    expect(days[1]?.name).toBe('Tomorrow')
  })
})

describe('mapWeatherResponseToSmallCards', () => {
  const hour = (epoch: number, clock: string, temp: number, code: number) => ({
    time_epoch: epoch,
    time: `2024-01-15 ${clock}`,
    temp_c: temp,
    condition: { text: '', icon: '//cdn.example.com/x.png', code },
  })

  it('returns empty when null or no hours', () => {
    expect(mapWeatherResponseToSmallCards(null, 12)).toEqual([])
    expect(
      mapWeatherResponseToSmallCards(
        dto({ forecast: { forecastday: [{ date: '2024-01-15', hour: [] }] } }),
        12,
      ),
    ).toEqual([])
  })

  it('picks next 5 hours from first hour >= currentLocalHour and labels first as Now', () => {
    const weather = dto({
      forecast: {
        forecastday: [
          {
            date: '2024-01-15',
            hour: [
              hour(1, '08:00', 5, 1000),
              hour(2, '10:00', 7, 1003),
              hour(3, '12:00', 9, 1063),
              hour(4, '14:00', 11, 1210),
              hour(5, '16:00', 13, 1000),
              hour(6, '18:00', 15, 1000),
            ],
          },
        ],
      },
    })

    const cards = mapWeatherResponseToSmallCards(weather, 10)
    expect(cards).toHaveLength(5)
    expect(cards[0]?.time).toBe('Now')
    expect(cards[0]?.temperatureC).toBe(7)
    expect(cards[1]?.time).toBe('12:00')
  })

  it('prefixes protocol-relative icon URLs', () => {
    const weather = dto({
      forecast: {
        forecastday: [
          {
            date: '2024-01-15',
            hour: [hour(1, '08:00', 5, 1000),
              hour(2, '09:00', 6, 1000),
              hour(3, '10:00', 7, 1000),
              hour(4, '11:00', 8, 1000),
              hour(5, '12:00', 9, 1000)],
          },
        ],
      },
    })
    const cards = mapWeatherResponseToSmallCards(weather, 8)
    expect(cards[0]?.iconUrl).toMatch(/^https:/)
  })
})
