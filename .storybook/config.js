import { addParameters, configure } from '@storybook/vue'
import Vue from 'vue'
import Vuex from 'vuex'
import '../assets/global.css'

import nacellePlugin from '../tests/mocks/nacelle-vue-plugin'
import nacelleHelpers from '../tests/mocks/nacelle-helpers'
import axiosModule from '../tests/mocks/axios-module'

Vue.use(Vuex)
Vue.use(nacellePlugin)
Vue.use(nacelleHelpers)
Vue.use(axiosModule)

const req = require.context('../components/stories', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)

addParameters({
  options: {
    showPanel: true,
    panelPosition: 'right'
  }
})
