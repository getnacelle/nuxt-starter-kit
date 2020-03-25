import { withInfo } from 'storybook-addon-vue-info';
import store from '../../store/store';

import CartFlyoutCheckoutButton from '../CartFlyoutCheckoutButton';

export default {
  title: 'Components | Cart',
  decorators: [withInfo],
};

export const FlyoutCheckoutButton = () => ({
  store,
  components: { CartFlyoutCheckoutButton },
  data() {
    return {};
  },
  template: '<cart-flyout-checkout-button/>',
});

FlyoutCheckoutButton.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
