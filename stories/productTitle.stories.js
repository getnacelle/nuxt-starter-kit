import { withInfo } from 'storybook-addon-vue-info'

import ProductTitle from '../components/nacelle/ProductTitle'

export default {
  title: 'Components | Product',
  decorators: [withInfo]
}

export const Title = () => ({
  components: { ProductTitle },
  template: '<product-title/>'
})

Title.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
