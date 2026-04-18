import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import type { Day } from '@/domain/models/Day'
import CardWeather from './CardWeather.vue'

const dayWeather: Day = {
  name: 'Denver',
  temperatureC: 21.4,
  iconUrl: 'https://cdn.example.com/icon.png',
  backgroundColor: '#E4F0FE',
  conditionText: 'Clear',
}

function mockViewport(isMobile: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('CardWeather', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('inline layout rules (mobile vs desktop × smallCard)', () => {
    beforeEach(() => {
      mockViewport(true)
    })

    it('mobile + smallCard: compact padding and font sizes', () => {
      const wrapper = mount(CardWeather, {
        props: { dayWeather, smallCard: true },
      })

      const article = wrapper.get('article.card-weather').element as HTMLElement
      expect(article.style.padding).toBe('2rem 1rem')

      const iconWrap = wrapper.get('.card-weather__icon-wrapper').element as HTMLElement
      expect(iconWrap.style.height).toBe('60px')
      expect(iconWrap.style.width).toBe('60px')
      expect(iconWrap.style.backgroundColor).toBe('transparent')

      const title = wrapper.get('.card-weather__title').element as HTMLElement
      expect(title.style.fontSize).toBe('1rem')

      const temp = wrapper.get('.card-weather__temperature').element as HTMLElement
      expect(temp.style.fontSize).toBe('1.5rem')

      const unit = wrapper.get('.card-weather__temperature-unit').element as HTMLElement
      expect(unit.style.fontSize).toBe('1rem')
    })

    it('mobile + main card: larger padding and white icon plate', () => {
      const wrapper = mount(CardWeather, {
        props: { dayWeather, smallCard: false },
      })

      const article = wrapper.get('article.card-weather').element as HTMLElement
      expect(article.style.padding).toBe('3rem 1rem')

      const iconWrap = wrapper.get('.card-weather__icon-wrapper').element as HTMLElement
      expect(iconWrap.style.backgroundColor).toBe('white')

      const title = wrapper.get('.card-weather__title').element as HTMLElement
      expect(title.style.fontSize).toBe('1.5rem')

      const temp = wrapper.get('.card-weather__temperature').element as HTMLElement
      expect(temp.style.fontSize).toBe('3rem')
    })
  })

  describe('desktop viewport (min-width breakpoint behavior via matchMedia)', () => {
    beforeEach(() => {
      mockViewport(false)
    })

    it('desktop + smallCard: tight horizontal padding and 60px icon', () => {
      const wrapper = mount(CardWeather, {
        props: { dayWeather, smallCard: true },
      })

      const article = wrapper.get('article.card-weather').element as HTMLElement
      expect(article.style.padding).toBe('0.5rem 1rem')

      const iconWrap = wrapper.get('.card-weather__icon-wrapper').element as HTMLElement
      expect(iconWrap.style.height).toBe('60px')
      expect(iconWrap.style.width).toBe('60px')

      const title = wrapper.get('.card-weather__title').element as HTMLElement
      expect(title.style.fontSize).toBe('1.2rem')

      const temp = wrapper.get('.card-weather__temperature').element as HTMLElement
      expect(temp.style.fontSize).toBe('2rem')
    })

    it('desktop + main card: default padding and 80px icon', () => {
      const wrapper = mount(CardWeather, {
        props: { dayWeather, smallCard: false },
      })

      const article = wrapper.get('article.card-weather').element as HTMLElement
      expect(article.style.padding).toBe('3rem')

      const iconWrap = wrapper.get('.card-weather__icon-wrapper').element as HTMLElement
      expect(iconWrap.style.height).toBe('80px')
      expect(iconWrap.style.width).toBe('80px')
      expect(iconWrap.style.backgroundColor).toBe('white')

      const title = wrapper.get('.card-weather__title').element as HTMLElement
      expect(title.style.fontSize).toBe('2rem')

      const temp = wrapper.get('.card-weather__temperature').element as HTMLElement
      expect(temp.style.fontSize).toBe('3rem')

      const unit = wrapper.get('.card-weather__temperature-unit').element as HTMLElement
      expect(unit.style.fontSize).toBe('1.5rem')
    })

    it('defaults smallCard to false (same as main card)', () => {
      const wrapper = mount(CardWeather, {
        props: { dayWeather },
      })

      const article = wrapper.get('article.card-weather').element as HTMLElement
      expect(article.style.padding).toBe('3rem')
    })
  })

  it('renders rounded temperature and condition text', () => {
    mockViewport(false)
    const wrapper = mount(CardWeather, {
      props: { dayWeather },
    })

    expect(wrapper.text()).toContain('21')
    expect(wrapper.text()).toContain('Clear')
    expect(wrapper.get('.card-weather__icon').attributes('src')).toBe(dayWeather.iconUrl)
  })
})
