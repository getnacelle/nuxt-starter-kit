import { keys, del } from 'idb-keyval'

export const state = () => ({
  collectionLimit: 12,
  productDataCleared: false,
  indexedDbWorker: null
})

export const mutations = {
  setProductsCleared(state, isCleared) {
    state.productDataCleared = isCleared
  },
  startIndexedDbWorker: (state) => {
    state.indexedDbWorker =
      state.indexedDbWorker || new Worker('/worker/indexedDb.js')
  }
}

export const actions = {
  async nuxtClientInit(ctx, context) {
    await this.$nacelle.nacelleNuxtServerInit(ctx, context)
  },
  async nuxtServerInit(ctx, context) {
    await this.$nacelle.nacelleNuxtServerInit(ctx, context)
  },
  async clearProductIdb({ state, commit }) {
    if (!state.productDataCleared) {
      commit('setProductsCleared', true)
      const idbKeys = await keys()

      const cleared = idbKeys
        .filter((key) => key.startsWith('product/'))
        .map((key) => del(key))

      await Promise.all(cleared)
    }
  },
  getIndexedDbWorker({ state, commit }) {
    if (!state.indexedDbWorker) {
      commit('startIndexedDbWorker')
    }

    return state.indexedDbWorker
  }
}
