import { withInfo } from 'storybook-addon-vue-info'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import ProductVariantSelect from '../nacelle/ProductVariantSelect'

import defaultMultivariate from '../../tests/mocks/multivariateProduct'

export default {
  title: 'Components | Product',
  decorators: [withInfo, withKnobs]
}

export const VariantSelect = () => ({
  components: {
    ProductVariantSelect
  },
  props: {
    showAtc: {
      default: boolean('Show Add to Cart', true)
    }
  },
  data() {
    return {
      product: defaultMultivariate,
      variant: defaultMultivariate.variants[0]
    }
  },
  methods: {
    onVariantSelect({ selectedVariant }) {
      this.variant = selectedVariant
    }
  },
  template: `
  <section class="section">
    <div class="columns is-centered">
    <div class="columns is-marginless is-paddingless">
    <product-variant-select
      :productHandle="product.handle"
      :variant="variant"
      v-on:variant-selected="onVariantSelect"
    />
  </div>
    </div>
  </section>`
})

VariantSelect.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
