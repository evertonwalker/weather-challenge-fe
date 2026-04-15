export interface CardWeather {
  placeName: string
  temperatureC: number
  conditionText: string
  conditionIconUrl: string
  backgroundColor?: string
  backgroundIcon?: string
}

export const defaultCardWeather: CardWeather = {
  placeName: '',
  temperatureC: 0,
  conditionText: '',
  conditionIconUrl: '',
  backgroundColor: '#C3E0FB',
  backgroundIcon: '#AED2F4',
}
