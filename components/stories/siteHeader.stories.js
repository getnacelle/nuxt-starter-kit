// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withInfo } from 'storybook-addon-vue-info';
import StoryRouter from 'storybook-vue-router';
import store from '../../.storybook/store';

import SiteHeader from '../SiteHeader';

export default {
  title: 'Components | Site Header',

  decorators: [
    withInfo,
    StoryRouter(),
    () => {
      return {
        template: '<div style="height: 1600px;"><story/></div>',
      };
    },
  ],
};

export const Default = () => ({
  store,
  components: { SiteHeader },
  mounted() {
    store.dispatch('cart/addLineItem', {
      image: {
        thumbnailSrc: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
      },
      title: 'Gray T-Shirt',
      productId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
      handle: 'gray-t-shirt',

      quantity: 1,
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yODU2ODgyMDIyMDAwOQ==',
        title: 'Cool Version',
        price: '29.99',
      },
    });
  },
  template: `
    <site-header>
      <template v-slot:menu>
        <router-link class="main-nav-item" :to="'/shop'">Shop</router-link>
      </template>
      <template v-slot:flyout-menu>
        <router-link class="main-nav-item" :to="'/shop'">Shop</router-link>
      </template>
    </site-header>
  `,
});

Default.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
