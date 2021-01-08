// import oboe from 'oboe'
// import { set } from 'idb-keyval'

export const state = () => ({
  query: null,
  autocompleteVisible: false,
  filtersCleared: false,
  searchData: {
    products: []
  },
  results: [],
  searchOptions: {
    relevanceThreshold: 0.5,
    keys: ['title']
  },
  filteredData: null,
  isLoading: false,
  resultsToDisplay: 12,
  searchWorker: null
})

export const getters = {
  queryOrigin(state) {
    if (state.query && state.query.origin) {
      return state.query.origin
    }

    return undefined
  },

  hasProductData(state) {
    return state.searchData.products.length > 0
  },

  productData(state, getters) {
    return getters.hasProductData
      ? state.searchData.products
      : []
  }
}

export const mutations = {
  setQuery(state, query) {
    state.query = query
  },

  setFilteredData(state, data) {
    state.filteredData = data
  },

  showMoreResults(state) {
    state.resultsToDisplay = state.resultsToDisplay + 12
  },

  resetResults(state) {
    state.resultsToDisplay = 12
  },

  setAutocompleteVisible(state, isVisible) {
    state.autocompleteVisible = isVisible
  },

  setFiltersCleared(state) {
    state.filtersCleared = true
  },

  setFiltersNotCleared(state) {
    state.filtersCleared = false
  },

  setSearchData(state, data) {
    state.searchData = {
      ...state.searchData,
      ...data
    }
    console.log(state.searchData)
  },
  // setSearchProduct(state, product) {
  //   state.searchData.products.push(product)
  // },

  setLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setResults(state, results) {
    state.results = results
  },
  startSearchWorker(state) {
    state.searchWorker = state.searchWorker || new Worker('/worker/search.js')
  }
}

export const actions = {
  // getProductData_HF({ commit, getters }) {
  //   if (getters.hasProductData) {
  //     return
  //   }
  //   commit('setLoading', true)

  //   const worker = new Worker('/worker/productCatalog.js')
  //   worker.postMessage({
  //     spaceID: process.env.NACELLE_SPACE_ID,
  //     token: process.env.NACELLE_GRAPHQL_TOKEN,
  //     version: process.env.NACELLE_API_VERSION
  //   })
  //   worker.onmessage = (e) => {
  //     const products = e.data
  //     commit('setSearchData', { products })
  //     commit('setLoading', false)
  //     worker.terminate()
  //   }
  // },
  async getProductData({commit, getters, state}) {
    if (getters.hasProductData && !state.isLoading) {
      return
    }
    console.time('timing')
    commit('setLoading', true)

    // oboe('/data/search.json')
    //   .node('product.*', product => {
    //     // commit('setSearchProduct', product)
    //     // console.log( 'Go get some', product.handle)
    //   })
    //   // TODO: handle all searchDataTypes
    //   .done(items => {
    //     commit('setSearchData', { products: items.product })
    //     commit('setLoading', false)
    //     // console.log('loaded', items.product.length, 'products')
    //     console.timeEnd('timing')
    //   })

    // fetch('/data/search.json')
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data)
    //     commit('setSearchData', { products: data.product })
    //     commit('setLoading', false)
    //     console.timeEnd('timing')
    //   })

    const worker = new Worker('/worker/productCatalog.js')
    worker.postMessage(null)
    worker.onmessage = (e) => {
      const products = e.data.product
      commit('setSearchData', { products })
      commit('setLoading', false)
      worker.terminate()
    }
  },

  searchCatalog({ state, getters, commit }, value) {
    commit('startSearchWorker')

    state.searchWorker.postMessage({
      searchData: getters.productData,
      options: state.searchOptions,
      value
    })
    state.searchWorker.onmessage = (e) => {
      commit('setResults', e.data)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
