import { withInfo } from 'storybook-addon-vue-info'
import CartFlyoutHeader from '../nacelle/CartFlyoutHeader'

export default {
  title: 'Components | Cart',
  decorators: [withInfo]
}

export const FlyoutHeader = () => ({
  components: { CartFlyoutHeader },
  data() {
    return {}
  },
  template: '<cart-flyout-header/>'
})

FlyoutHeader.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
