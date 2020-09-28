const eventProperties = rootState => {
  const { user, space, cart } = rootState || {}
  const spaceId = space ? space.id : null
  const userId = user && user.userID ? user.userID : null
  const anonymousId = user && user.anonymousId ? user.anonymousId : null
  return {
    spaceId,
    ...(cart && cart.lineItems && { cart: cart.lineItems }),
    user: {
      ...user,
      userId,
      anonymousId
    }
  }
}
export const state = () => ({
  log: []
})

export const mutations = {
  addEvent(state, event) {
    state.log.push(event)
  }
}

export const actions = {
  pageView({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'pageView',
      ...eventProperties(rootState),
      ...payload
    })
  },

  productView({ commit, rootState }, product) {
    commit('addEvent', {
      eventType: 'productView',
      ...eventProperties(rootState),
      product
    })
  },

  collectionView({ commit, rootState }, collection) {
    commit('addEvent', {
      eventType: 'collectionView',
      ...eventProperties(rootState),
      collection
    })
  },

  blogView({ commit, rootState }, blog) {
    commit('addEvent', {
      eventType: 'blogView',
      ...eventProperties(rootState),
      blog
    })
  },

  articleView({ commit, rootState }, article) {
    commit('addEvent', {
      eventType: 'articleView',
      ...eventProperties(rootState),
      article
    })
  },

  addToCart({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'cartAdd',
      ...eventProperties(rootState),
      ...payload
    })
  },

  removeFromCart({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'cartRemove',
      ...eventProperties(rootState),
      ...payload
    })
  },

  checkoutInit({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'checkoutInit',
      ...eventProperties(rootState),
      ...payload
    })
  },

  checkoutComplete({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'checkoutComplete',
      ...eventProperties(rootState),
      ...payload
    })
  },

  search({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'search',
      ...eventProperties(rootState),
      ...payload
    })
  },

  productRecommendation({ commit, rootState }, payload) {
    commit('addEvent', {
      eventType: 'productRecommendation',
      ...payload,
      ...eventProperties(rootState)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
