import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { WeatherApi } from '@/infrastructure/http/WeatherApi'

describe('WeatherApi', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('calls forecast.json with place, days and lang query params', async () => {
    const json = { location: { name: 'Test' } }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => json,
    } as Response)

    const api = new WeatherApi()
    const result = await api.getForecastByPlace('São Paulo')

    expect(fetch).toHaveBeenCalledTimes(1)
    const url = vi.mocked(fetch).mock.calls[0]?.[0] as string
    expect(url).toContain('/forecast.json')
    const parsed = new URL(url)
    expect(parsed.searchParams.get('q')).toBe('São Paulo')
    expect(parsed.searchParams.get('days')).toBe('3')
    expect(parsed.searchParams.get('lang')).toBe('pt')
    expect(result).toEqual(json)
  })

  it('throws when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as Response)

    const api = new WeatherApi()
    await expect(api.getForecastByPlace('x')).rejects.toThrow('Weather API error: 401')
  })
})
