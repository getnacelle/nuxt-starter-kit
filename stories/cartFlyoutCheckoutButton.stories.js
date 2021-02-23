import { withInfo } from 'storybook-addon-vue-info'
import CartFlyoutCheckoutButton from '../components/nacelle/CartFlyoutCheckoutButton'

export default {
  title: 'Components | Cart',
  decorators: [withInfo]
}

export const FlyoutCheckoutButton = () => ({
  components: { CartFlyoutCheckoutButton },
  data() {
    return {}
  },
  template: '<cart-flyout-checkout-button/>'
})

FlyoutCheckoutButton.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
