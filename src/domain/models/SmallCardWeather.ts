export interface SmallCardWeather {
  time: string
  iconUrl: string
  backgroundColor: string
  temperatureC: number
}

export const defaultSmallCardWeather: SmallCardWeather = {
  time: '',
  iconUrl: '',
  backgroundColor: '#C3E0FB',
  temperatureC: 0,
}
