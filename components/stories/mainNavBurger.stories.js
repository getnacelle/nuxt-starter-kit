import { withInfo } from 'storybook-addon-vue-info';
import store from '../../store/store';

import MainNavBurger from '../MainNavBurger';

export default {
  title: 'Components | Main Nav',

  decorators: [
    withInfo,
    () => {
      return {
        template: '<div style="padding: 3rem;"><story/></div>',
      };
    },
  ],
};

export const Burger = () => ({
  store,
  components: { MainNavBurger },
  template: `
    <main-nav-burger />
  `,
});

Burger.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
