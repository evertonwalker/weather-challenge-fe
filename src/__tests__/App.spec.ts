import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

import App from '../App.vue'
import { getWeatherByPlaceUseCaseKey, savedPlacesRepositoryKey } from '@/core/di/injectionKeys'

describe('App', () => {
  it('mounts and shows the title', () => {
    const execute = vi.fn().mockRejectedValue(new Error('network'))
    const savedPlacesRepository = {
      loadAll: vi.fn().mockReturnValue([]),
      addIfNew: vi.fn(),
    }

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        provide: {
          [getWeatherByPlaceUseCaseKey]: { execute },
          [savedPlacesRepositoryKey]: savedPlacesRepository,
        },
      },
    })

    expect(wrapper.text()).toContain('Hello there!')
  })
})
