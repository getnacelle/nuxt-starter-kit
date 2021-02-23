import { withInfo } from 'storybook-addon-vue-info'
import { withKnobs, button } from '@storybook/addon-knobs'
import InterfaceModal from '../components/nacelle/InterfaceModal'
const label = 'Show Modal'

export default {
  title: 'Components | General',

  decorators: [
    withInfo,
    withKnobs,
    () => ({
      template: '<div style="padding: 3rem;"><story/></div>'
    })
  ]
}

export const Modal = () => ({
  components: { InterfaceModal },
  data() {
    return {
      open: true
    }
  },
  template: `
    <interface-modal :modalOpen="open" v-on:closeModal="open = false">
    <h1>This is a modal.</h1>
    <p>Great work!</p>
    </interface-modal>
  `,
  created() {
    button(label, () => {
      this.open = true
    })
  }
})

Modal.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
