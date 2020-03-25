/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { withActions } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from 'storybook-addon-vue-info'
import StoryRouter from 'storybook-vue-router'
import store from '../../store/store'
import SearchBox from '../SearchBox'
import searchResults from '../../.storybook/defaults/search-results'

export default {
  title: 'Components | Search',

  decorators: [withInfo, withKnobs, StoryRouter(), withActions(), () => ({
      template: `
        <div style="max-width: 450px; margin: 3rem auto;"><story/></div>
      `
    })],
};

export const SearchBoxGlobal = () => ({
  store,
  components: { SearchBox },
  template: `
    <search-box />
  `,
  created() {
    const mock = new MockAdapter(axios)

    mock.onGet('/data/search.json').reply(200, searchResults)
  }
});

SearchBoxGlobal.story = {
  name: 'Search Box - Global',

  parameters: {
    info: {
      // summary: "Hello"
    }
  },
};
