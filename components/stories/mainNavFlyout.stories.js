import { withKnobs, button } from '@storybook/addon-knobs';
import { withInfo } from 'storybook-addon-vue-info';
import StoryRouter from 'storybook-vue-router';
import store from '../../.storybook/store';

import MainNavFlyout from '../MainNavFlyout';

const label = 'Toggle Menu';
const handler = () => {
  store.commit('menu/toggleShowMenu');
};

export default {
  title: 'Components | Main Nav',
  decorators: [withInfo, withKnobs, StoryRouter()],
};

export const _MainNavFlyout = () => ({
  store,
  components: { MainNavFlyout },
  template: `
    <main-nav-flyout>
      <template v-slot:flyout-menu>
        <router-link class="main-nav-item" :to="'/shop'">Shop</router-link>
      </template>
    </main-nav-flyout>
  `,
  created() {
    button(label, handler);
  },
});

_MainNavFlyout.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
