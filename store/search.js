import axios from 'axios'
import generateProductData from '@nacelle/replicator'

export const state = () => ({
  query: null,
  autocompleteVisible: false,
  filtersCleared: false,
  searchData: {},
  loadedData: false,
  searchLoading: false
})

export const getters = {
  queryOrigin (state) {
    if (state.query && state.query.origin) {
      return state.query.origin
    }

    return undefined
  },
  hasProductData (state) {
    return (
      state.searchData &&
      state.searchData.products &&
      state.searchData.products.length > 0
    )
  },
  productData (state) {
    if (
      state.searchData &&
      state.searchData.products &&
      state.searchData.products.length > 0
    ) {
      return generateProductData(100).map(product => {
        const { tags, variants, ...rest } = product

        /// //////////////////////////
        /// //////////////////////////
        // Get product filter facets from variant data
        const variantOptions = variants.map(variant => {
          return variant.selectedOptions
        })

        const variantFacets = variantOptions.reduce((acc, item) => {
          return acc.concat(item)
        }, []).map(option => JSON.stringify(option))

        const facets = Array.from(new Set(variantFacets)).map(option => JSON.parse(option)).map(option => {
          return { name: option.name.toLowerCase(), value: option.value }
        })

        /// //////////////////////////
        /// //////////////////////////
        // Get product filter facets from tags. Tags should be formatted "filter_property-name_value"
        const rootFacets = tags.filter(tag => tag.includes('filter'))

        rootFacets.forEach(facet => {
          const facetFragments = facet.split('_')
          const facetName = facetFragments[1]
          const facetValue = () => {
            const fragments = facetFragments[2].split('-')
            return fragments.map(fragment => {
              return `${fragment.charAt(0).toUpperCase()}${fragment.substring(1)}`
            }).join(' ')
          }

          rest[facetName] = facetValue()
          facets.push({ name: facetName, value: facetValue() })
        })

        if (product.productType) {
          facets.push({ name: 'productType', value: product.productType })
        }

        rest.minPrice = rest.priceRange.min

        return { ...rest, tags, variantOptions, variants, facets }
      })
    }

    return []
  }
}

export const mutations = {
  setQuery (state, query) {
    state.query = query
  },

  setAutocompleteVisible (state) {
    state.autocompleteVisible = true
  },

  setAutocompleteNotVisible (state) {
    state.autocompleteVisible = false
  },

  setFiltersCleared (state) {
    state.filtersCleared = true
  },

  setFiltersNotCleared (state) {
    state.filtersCleared = false
  },

  setSearchData (state, data) {
    state.searchData = {
      ...state.searchData,
      ...data
    }
  },

  dataHasLoaded (state) {
    state.loadedData = true
  },

  dataNotLoaded (state) {
    state.loadedData = false
  },

  isSearching (state) {
    state.searchLoading = true
  },

  isNotSearching (state) {
    state.searchLoading = false
  }
}

export const actions = {
  getProductData ({ commit, getters }) {
    if (!getters.hasProductData) {
      commit('dataNotLoaded')
      commit('isSearching')

      axios
        .get('/data/search.json')
        .then(res => {
          if (res && res.data) {
            commit('dataHasLoaded')
            commit('isNotSearching')

            commit('setSearchData', res.data)
          }
        })
        .catch(err => {
          console.log(err)
          return err
        })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
