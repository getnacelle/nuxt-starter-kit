import { withInfo } from 'storybook-addon-vue-info';

import store from '../../store/store';

import ProductImage from '../ProductImage';
import ProductPrice from '../ProductPrice';
import ProductTitle from '../ProductTitle';
import ProductDescription from '../ProductDescription';
import ProductCategory from '../ProductCategory';
import ProductAddToCartButton from '../ProductAddToCartButton';
import ProductQuantityUpdate from '../ProductQuantityUpdate';
import ProductOptions from '../ProductOptions';
import ProductVariantSelect from '../ProductVariantSelect';
import CartFlyout from '../CartFlyout';
import CartFlyoutItem from '../CartFlyoutItem';

import defaultMultivariate from '../../.storybook/defaults/multivariateProduct';

export default {
  title: 'Components | Product/Composition',
  decorators: [withInfo],
};

export const Pdp = () => ({
  components: {
    ProductPrice,
    ProductTitle,
    ProductDescription,
    ProductCategory,
    ProductImage,
    ProductAddToCartButton,
    ProductQuantityUpdate,
    ProductOptions,
    ProductVariantSelect,
    CartFlyout,
    CartFlyoutItem,
  },
  store,
  data() {
    return {
      product: defaultMultivariate,
      variant: defaultMultivariate.variants[0],
    };
  },
  methods: {
    onVariantSelect({ options, selectedVariant }) {
      this.variant = selectedVariant;
    },
  },

  template: `
  <section class="section">
    <div class="container is-marginless is-paddingless">
      <div class="columns">
        <div class="column is-6">
          <product-image :source="product.featuredMedia.src"/>
        </div>
        <div class="column is-6">
          <product-title :title="product.title"/>
          <product-category :category="product.category"/>
          <product-description :description="product.description"/>
          <product-price :price="variant.price"></product-price>
          <div class="columns is-marginless is-paddingless">
            <product-variant-select
              :product="product"
              :variant="variant"
              v-on:variant-selected="onVariantSelect"
            />
          </div>
        </div>
      </div>
    </div>
  </section>`,
});

Pdp.story = {
  name: 'PDP',

  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
