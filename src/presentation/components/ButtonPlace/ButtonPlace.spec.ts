import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ButtonPlace from './ButtonPlace.vue'

describe('ButtonPlace', () => {
  it('renders name and applies background color', () => {
    const wrapper = mount(ButtonPlace, {
      props: {
        name: 'Madrid',
        color: '#C3E0FB',
      },
    })

    const btn = wrapper.get('button.button-place')
    expect(btn.text()).toBe('Madrid')
    expect((btn.element as HTMLButtonElement).style.backgroundColor).toBe('rgb(195, 224, 251)')
    expect(btn.attributes('type')).toBe('button')
  })
})
