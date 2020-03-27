import { withInfo } from 'storybook-addon-vue-info';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import store from '../../.storybook/store';

import ProductVariantSelect from '../ProductVariantSelect';
import CartFlyout from '../CartFlyout';
import CartFlyoutItem from '../CartFlyoutItem';

import defaultMultivariate from '../../.storybook/defaults/multivariateProduct';

export default {
  title: 'Components | Product',
  decorators: [withInfo, withKnobs],
};

export const VariantSelect = () => ({
  components: {
    ProductVariantSelect,
    CartFlyout,
    CartFlyoutItem,
  },
  store,
  props: {
    showAtc: {
      default: boolean('Show Add to Cart', true),
    },
  },
  data() {
    return {
      product: defaultMultivariate,
      variant: defaultMultivariate.variants[0],
    };
  },
  methods: {
    onVariantSelect({ selectedVariant }) {
      console.log(selectedVariant);
      this.variant = selectedVariant;
    },
  },
  template: `
  <section class="section">
    <div class="columns is-centered">
    <div class="columns is-marginless is-paddingless">
    <product-variant-select
      :product="product"
      :variant="variant"
      v-on:variant-selected="onVariantSelect"
    />
  </div>
    </div>
  </section>`,
});

VariantSelect.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
