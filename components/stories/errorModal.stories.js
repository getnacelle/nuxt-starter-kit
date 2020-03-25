import { withInfo } from 'storybook-addon-vue-info';
import { withKnobs, button } from '@storybook/addon-knobs';
import ErrorModal from '../ErrorModal';
import store from '../../store/store';

const label = 'Trigger Error';

export default {
  title: 'Components | General',

  decorators: [
    withInfo,
    withKnobs,
    () => ({
      template: '<div style="padding: 3rem;"><story/></div>',
    }),
  ],
};

export const _ErrorModal = () => ({
  store,
  components: { ErrorModal },
  template: `
    <error-modal/>
  `,
  created() {
    button(label, () => {
      store.commit('cart/setCartError', 'this is an error');
    });
  },
});

_ErrorModal.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
