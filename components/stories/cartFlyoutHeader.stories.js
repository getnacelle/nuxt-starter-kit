import { withInfo } from 'storybook-addon-vue-info';
import store from '../../store/store';

import CartFlyoutHeader from '../CartFlyoutHeader';

export default {
  title: 'Components | Cart',
  decorators: [withInfo],
};

export const FlyoutHeader = () => ({
  store,
  components: { CartFlyoutHeader },
  data() {
    return {};
  },
  template: '<cart-flyout-header/>',
});

FlyoutHeader.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
