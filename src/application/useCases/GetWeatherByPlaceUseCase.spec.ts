import { describe, it, expect, vi } from 'vitest'

import type { WeatherForecastResponseDto } from '@/domain/contracts/weatherForecastResponse.dto'
import { GetWeatherByPlaceUseCase } from '@/application/useCases/GetWeatherByPlaceUseCase'

describe('GetWeatherByPlaceUseCase', () => {
  it('delegates to WeatherForecastRepository.getForecastByPlace', async () => {
    const payload = { location: { name: 'X' } } as WeatherForecastResponseDto
    const getForecastByPlace = vi.fn().mockResolvedValue(payload)

    const useCase = new GetWeatherByPlaceUseCase({ getForecastByPlace })
    const result = await useCase.execute('Berlin')

    expect(getForecastByPlace).toHaveBeenCalledTimes(1)
    expect(getForecastByPlace).toHaveBeenCalledWith('Berlin')
    expect(result).toBe(payload)
  })
})
