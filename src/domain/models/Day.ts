export interface Day {
  name: string
  temperatureC: number
  iconUrl: string
  backgroundColor: string
  conditionText: string
}

export const defaultDay: Day = {
  name: '',
  temperatureC: 0,
  iconUrl: '',
  backgroundColor: '#C3E0FB',
  conditionText: '',
}
