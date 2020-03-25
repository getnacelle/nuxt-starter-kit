import { withActions, action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
import { withInfo } from 'storybook-addon-vue-info';
import StoryRouter from 'storybook-vue-router';
import store from '../../store/store';
import RefinementFilters from '../RefinementFilters';
import searchResults from '../../.storybook/defaults/search-results';

const defaultFilters = [
  {
    field: 'productType',
    label: 'Product Type',
  },
];

export default {
  title: 'Components | Search',

  decorators: [
    withInfo,
    withKnobs,
    StoryRouter(),
    withActions('updated'),
    () => {
      return {
        template: `
          <div style="max-width: 450px; margin: 3rem auto;"><story/></div>
        `,
      };
    },
  ],
};

export const _RefinementFilters = () => ({
  store,
  components: { RefinementFilters },
  props: {
    filters: {
      type: Object,
      default: object('Filters Object', defaultFilters),
    },
  },
  data() {
    return {
      products: searchResults,
      filtered: [],
    };
  },
  methods: {
    onUpdate: action('Products Filtered'),
  },
  template: `
      <refinement-filters
        :input-data="products"
        :filter-properties="filters"
        v-on:updated="onUpdate"
      />
    `,
});

_RefinementFilters.story = {
  parameters: {
    info: {
      // summary: "Hello"
    },
  },
};
