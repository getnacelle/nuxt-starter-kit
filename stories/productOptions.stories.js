import { withInfo } from 'storybook-addon-vue-info'
import ProductOptions from '../components/nacelle/ProductOptions'

export default {
  title: 'Components | Product',
  decorators: [withInfo]
}

export const Options = () => ({
  components: { ProductOptions },
  data() {
    return {
      options: [
        {
          name: 'Size',
          values: ['xs', 'small', 'medium', 'large', 'xl', 'xxl']
        },
        {
          name: 'Shape',
          values: ['Oval', 'Triangle', 'Square']
        },
        {
          name: 'Color',
          values: ['white', 'red', 'blue']
        }
      ]
    }
  },
  template: '<product-options style="width:500px" :options="options"/>'
})

Options.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
