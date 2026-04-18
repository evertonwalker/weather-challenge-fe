import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import { useIsMobile } from '@/composables/useIsMobile'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
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

const TestHarness = defineComponent({
  setup() {
    const { isMobileViewport } = useIsMobile()
    return { isMobileViewport }
  },
  template: '<span data-testid="flag">{{ isMobileViewport }}</span>',
})

describe('useIsMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reflects matchMedia.matches for max-width 1023px', async () => {
    mockMatchMedia(true)
    const wrapper = mount(TestHarness)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-testid="flag"]').text()).toBe('true')

    wrapper.unmount()
  })

  it('is false when matchMedia reports desktop', async () => {
    mockMatchMedia(false)
    const wrapper = mount(TestHarness)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-testid="flag"]').text()).toBe('false')
  })
})
