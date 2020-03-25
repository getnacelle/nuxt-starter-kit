import { withInfo } from 'storybook-addon-vue-info';

import ProductCategory from '../ProductCategory';

export default {
  title: 'Components | Product',
  decorators: [withInfo],
};

export const Category = () => ({
  components: { ProductCategory },
  template: '<product-category/>',
});

Category.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
