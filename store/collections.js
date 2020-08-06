export const state = () => ({
  collections: []
})

export const getters = {
  getCollection: state => handle => {
    return state.collections.find(collection => collection.handle === handle)
  }
}

export const mutations = {
  addCollection(state, collection) {
    state.collections.push(collection)
  },

  updateCollection(state, collection) {
    if (collection && collection.handle) {
      const index = state.collections.findIndex(({ handle }) => {
        return handle === collection.handle
      })

      if (index > -1) {
        state.collections[index] = collection
      } else {
        state.collections.push(collection)
      }
    }
  },

  updateCollectionProducts(state, payload) {
    if (payload.products) {
      const index = state.collections.findIndex(({ handle }) => {
        return handle === payload.handle
      })

      if (index > -1) {
        state.collections[index].products = payload.products
        state.collections[index].productIndex = payload.productIndex
      }
    }
  }
}

export const actions = {
  addCollection({ commit }, collection) {
    commit('addCollection', collection)
    commit(
      'products/upsertProducts',
      collection.products.map(product => ({ product })),
      { root: true }
    )
  },

  updateCollection({ commit }, collection) {
    commit('updateCollection', collection)
    commit(
      'products/upsertProducts',
      collection.products.map(product => ({ product })),
      { root: true }
    )
  },

  updateCollectionProducts({ commit }, payload) {
    commit('updateCollectionProducts', payload)
    commit(
      'products/upsertProducts',
      payload.products.map(product => ({ product })),
      { root: true }
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
