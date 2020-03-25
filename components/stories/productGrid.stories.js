import { withInfo } from 'storybook-addon-vue-info';
import StoryRouter from 'storybook-vue-router';

import ProductGrid from '../ProductGrid';
import InterfaceModal from '../InterfaceModal';
import store from '../../store/store';

import { defaultProduct } from '../../.storybook/defaultObjects.js';

const productArray = [defaultProduct, defaultProduct, defaultProduct];

export default {
  title: 'Components | Product / Composition',

  decorators: [
    withInfo,
    StoryRouter(),
    () => {
      return {
        template: `
          <div style="padding: 3rem;"><story/></div>
        `,
      };
    },
  ],
};

export const _ProductGrid = () => ({
  components: { ProductGrid, InterfaceModal },
  store,
  data() {
    return {
      title: 'Product Grid',
      products: productArray,
    };
  },
  template: `<div>
  <interface-modal/>
  <product-grid :products="products" :showAddToCart="true" :showQuantityUpdate="true"/>
  </div>`,
});

_ProductGrid.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
