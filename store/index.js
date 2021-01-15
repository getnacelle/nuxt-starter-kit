import { clear, set, get, keys} from 'idb-keyval'

export const state = () => ({
  collectionLimit: 12,
  productDataCleared: false
})

export const mutations = {
  setProductsCleared(state, isCleared) {
    state.productDataCleared = isCleared
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
  }
}
