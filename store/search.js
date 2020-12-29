export const state = () => ({
  query: null,
  autocompleteVisible: false,
  filtersCleared: false,
  searchData: {},
  filteredData: null,
  loadedData: false,
  searchLoading: false,
  resultsToDisplay: 12
})

export const getters = {
  queryOrigin(state) {
    if (state.query && state.query.origin) {
      return state.query.origin
    }

    return undefined
  },

  hasProductData(state) {
    return state.searchData?.products?.length > 0
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

  setAutocompleteVisible(state) {
    state.autocompleteVisible = true
  },

  setAutocompleteNotVisible(state) {
    state.autocompleteVisible = false
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

  dataHasLoaded(state) {
    state.loadedData = true
  },

  dataNotLoaded(state) {
    state.loadedData = false
  },

  isSearching(state) {
    state.searchLoading = true
  },

  isNotSearching(state) {
    state.searchLoading = false
  }
}

export const actions = {
  getProductData({ commit, getters }) {
    if (getters.hasProductData) {
      return
    }
    commit('dataNotLoaded')
    commit('isSearching')

    const worker = new Worker('/catalogWorker.js')
    worker.postMessage({
      spaceID: process.env.NACELLE_SPACE_ID,
      token: process.env.NACELLE_GRAPHQL_TOKEN,
      version: process.env.NACELLE_API_VERSION
    })
    worker.onmessage = (e) => {
      console.log(e)
      const products = e.data
      commit('setSearchData', { products })
      commit('dataHasLoaded')
      commit('isNotSearching')
      worker.terminate()
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
