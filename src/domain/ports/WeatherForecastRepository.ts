import type { WeatherForecastResponseDto } from '@/domain/contracts/weatherForecastResponse.dto'

/**
 * Port: leitura de previsão por local. A infraestrutura fornece a implementação (ex.: HTTP).
 */
export interface WeatherForecastRepository {
  getForecastByPlace(place: string): Promise<WeatherForecastResponseDto>
}
