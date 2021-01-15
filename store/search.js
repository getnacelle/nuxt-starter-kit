
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
  },

  setLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setResults(state, results) {
    state.results = results
  },
  startSearchWorker(state, searchData) {
    state.searchWorker = state.searchWorker || new Worker('/worker/search.js')
    state.searchWorker.postMessage({ searchData })
  }
}

export const actions = {
  async getSearchData({commit, getters, state}) {
    if (getters.hasProductData && !state.isLoading) {
      return
    }
    commit('setLoading', true)

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
    commit('startSearchWorker', getters.productData)

    state.searchWorker.postMessage({
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
