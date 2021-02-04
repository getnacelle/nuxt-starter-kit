import { clear, set, get, keys} from 'idb-keyval'

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
    state.indexedDbWorker = state.indexedDbWorker || new Worker('/worker/indexedDb.js')
  }
}

export const actions = {
  async nuxtClientInit(ctx, context) {
    await this.$nacelle.nacelleNuxtServerInit(ctx, context)
  },
  async nuxtServerInit(ctx, context) {
    await this.$nacelle.nacelleNuxtServerInit(ctx, context)
  },
  async clearProductIdb({state, commit}) {
    const idbKeys = await keys()

    if (!state.productDataCleared && idbKeys.length > 1) {
      commit('setProductsCleared', true)
      const anonymousID = await get('anonymousID')
      clear()
      return set('anonymousID', anonymousID)
    }
    return
  },
  getIndexedDbWorker({state, commit}) {
    if (!state.indexedDbWorker) {
      commit('startIndexedDbWorker')
    }
    return state.indexedDbWorker
  }
}
