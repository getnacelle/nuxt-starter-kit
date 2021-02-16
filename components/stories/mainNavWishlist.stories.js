import { withInfo } from 'storybook-addon-vue-info'
import StoryRouter from 'storybook-vue-router'

import MainNavWishlist from '../nacelle/MainNavWishlist'

export default {
  title: 'Components | Main Nav',
  decorators: [withInfo, StoryRouter()]
}

export const _MainNavWishlist = () => ({
  components: { MainNavWishlist },
  template: `
    <main-nav-wishlist />
  `
})

_MainNavWishlist.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
