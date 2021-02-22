import { shallowMount } from '@vue/test-utils'
import ProductVariantTitle from '@/components/nacelle/ProductVariantTitle'

describe('ProductVariantTitle.vue', () => {
  it('renders a variant title', () => {
    const wrapper = shallowMount(ProductVariantTitle, {
      propsData: { title: 'Great Product' }
    })

    expect(wrapper.text).toBe('Great Product')
    expect(wrapper.classes).toBe(['variant-title', 'nacelle'])
  })
})
