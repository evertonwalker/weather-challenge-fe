import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SmallCardWeather from '@/presentation/components/SmallCardWeather.vue'

describe('SmallCardWeather', () => {
  it('renders time, icon, background and rounded temperature', () => {
    const wrapper = mount(SmallCardWeather, {
      props: {
        time: '14:00',
        iconUrl: 'https://example.com/w.png',
        backgroundColor: '#CDF0EB',
        temperatureC: 18.7,
      },
    })

    expect(wrapper.get('.small-card-weather__time').text()).toBe('14:00')

    const icon = wrapper.get('.small-card-weather__icon')
    expect(icon.attributes('src')).toBe('https://example.com/w.png')
    expect(icon.attributes('alt')).toBe('14:00')

    const iconWrap = wrapper.get('.small-card-weather__icon-wrapper').element as HTMLElement
    expect(iconWrap.style.backgroundColor).toBe('rgb(205, 240, 235)')

    expect(wrapper.get('.small-card-weather__temp').text()).toContain('19')
    expect(wrapper.get('.small-card-weather__temp').text()).toContain('°C')
  })

  it('rounds temperature toward nearest integer', () => {
    const wrapper = mount(SmallCardWeather, {
      props: {
        time: 'Now',
        iconUrl: '/icon.png',
        backgroundColor: '#C3E0FB',
        temperatureC: 20.4,
      },
    })

    expect(wrapper.get('.small-card-weather__temp').text()).toMatch(/20/)
  })
})
