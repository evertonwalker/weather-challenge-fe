import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import InputPlace from '@/presentation/components/InputPlace.vue'

describe('InputPlace', () => {
  it('emits search with trimmed value when Search is clicked', async () => {
    const wrapper = mount(InputPlace)

    await wrapper.get('.input-place__field').setValue('  London  ')
    await wrapper.get('.input-place__btn').trigger('click')

    expect(wrapper.emitted('search')).toHaveLength(1)
    expect(wrapper.emitted('search')?.[0]).toEqual(['London'])
  })

  it('emits search on Enter in the input', async () => {
    const wrapper = mount(InputPlace)

    await wrapper.get('.input-place__field').setValue('Paris')
    await wrapper.get('.input-place__field').trigger('keydown.enter')

    expect(wrapper.emitted('search')?.[0]).toEqual(['Paris'])
  })

  it('exposes clear() to reset the field', async () => {
    const wrapper = mount(InputPlace)

    await wrapper.get('.input-place__field').setValue('Berlin')
    expect((wrapper.get('.input-place__field').element as HTMLInputElement).value).toBe('Berlin')

    const vm = wrapper.vm as { clear: () => void }
    vm.clear()
    await nextTick()

    expect((wrapper.get('.input-place__field').element as HTMLInputElement).value).toBe('')
  })
})
