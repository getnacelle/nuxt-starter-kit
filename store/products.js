import axios from 'axios'
import Vue from 'vue'
import deepmerge from 'deepmerge'

const defaultProductData = {
  product: {
    priceRange: {
      min: '0.0',
      max: '0.00',
      currencyCode: 'USD'
    },
    title: null,
    featuredMedia: {
      src: undefined
    },
    id: null,
    handle: '',
    variants: []
  },
  recommendations: [],
  selectedVariant: undefined,
  metafields: [],
  quantity: 1,
  allOptionsSelected: false,
  confirmedSelection: false,
  onlyOneOption: false
}

export const state = () => ({
  products: {},
  currentProductHandle: ''
})

export const getters = {
  getCurrentProductData: state => {
    const productData =
      state.products[state.currentProductHandle] || defaultProductData
    return productData
  },

  getProduct: state => handle => {
    const productData = state.products[handle] || defaultProductData
    return productData.product || defaultProductData.product
  },

  /**
   * @param {string} handle - Product handle to get recommendations for.
   * @param {string} options.limit - Default is 0 (all). Max number of recommendtations to get. 0 gets all.
   * @param {string} options.source - Default is 'rule'. Source of recommendations. Possible values: 'all', 'rule', or 'generated'.
   * @param {boolean} options.cascade - Default is true. Use alternate source if no recommendations available?
   */
  getRecommendations: state => (handle, options = {}) => {
    const defaultOptions = {
      limit: 0,
      source: 'rule',
      cascade: true
    }
    const { limit, source, cascade } = { ...defaultOptions, ...options }
    const productData = state.products[handle] || defaultProductData
    const recommendationsData = productData.recommendations
    const sourceRecommendations = recommendationsData.filter(
      r => r.source === source
    )
    const recommendations =
      sourceRecommendations.length || !cascade
        ? sourceRecommendations
        : recommendationsData

    return recommendations.slice(0, limit || recommendations.length)
  },

  getCartProduct: state => handle => {
    const productData = state.products[handle] || defaultProductData
    const product = productData.product
    return {
      image: product.featuredMedia,
      title: product.title,
      productId: product.id,
      price: productData.currentPrice,
      handle: product.handle,
      variant: productData.selectedVariant
    }
  },

  getProductData: state => handle => {
    const productData = state.products[handle] || defaultProductData
    return productData
  },

  getSelectedVariant: state => handle => {
    const productData = state.products[handle]
    if (!productData) {
      return
    }

    if (productData.selectedVariant) {
      return productData.selectedVariant
    }

    if (
      productData.product &&
      productData.product.variants &&
      productData.product.variants.length > 0
    ) {
      return productData.product.variants[0]
    }

    return
  }
}

export const mutations = {
  // insert/add or update products in state
  upsertProducts: (state, products) =>
    (products || []).forEach(productData => {
      if (!productData.product || !productData.product.handle) {
        return
      }

      const {
        product: { handle }
      } = productData

      const existingProductData = state.products[handle] || defaultProductData

      state.products = {
        ...state.products,
        [handle]: deepmerge(existingProductData, productData, {
          arrayMerge: (dest, source) => source
        })
      }
    }),

  setCurrentProductHandle: (state, handle) =>
    (state.currentProductHandle = handle),

  setSelectedVariant(state, { productHandle, variantId }) {
    const productData = state.products[productHandle]
    if (
      !productData ||
      !productData.product ||
      !productData.product.variants ||
      !variantId
    ) {
      return
    }

    const variant = productData.product.variants.find(
      variant => variant.id === variantId
    )
    productData.selectedVariant = variant
  }
}

export const actions = {
  loadProduct: async ({ rootState, commit }, { productHandle }) => {
    const locale = rootState.user.locale.locale
    const loadFromFile = () => {
      const fs = require('fs')
      const file = fs.readFileSync(
        `./static/data/products/${productHandle}--${locale}/static.json`,
        'utf-8'
      )
      return JSON.parse(file)
    }

    const loadFromNacelle = async () => {
      return await Vue.prototype.$nuxt.$nacelle.data.product({
        handle: productHandle,
        locale: locale
      })
    }

    const product = process.server ? loadFromFile() : await loadFromNacelle()

    commit('upsertProducts', [{ product }])
  },

  loadProductRecommendations: async (
    { rootState, state, dispatch, commit },
    { productHandle }
  ) => {
    if (!productHandle) {
      return
    }

    const existingProduct = state.products[productHandle]
    if (
      existingProduct &&
      existingProduct.recommendations &&
      existingProduct.recommendations.length
    ) {
      return
    }

    const locale = (rootState.user.locale.locale || 'en-us').toLowerCase()
    const nacelleStaticUrl = process.env.DEV_MODE
      ? 'nacellestatic-dev.s3.amazonaws.com'
      : 'nacellestatic.s3.amazonaws.com'

    let generatedRecommendations
    try {
      const recommendationsData = await axios.get(
        `https://${nacelleStaticUrl}/${process.env.nacelleSpaceID}/merchandising/products/${productHandle}--${locale}.json`
      )
      generatedRecommendations = JSON.parse(recommendationsData.data)
    } catch (error) {
      console.log(
        `Unable to load product recommendations for ${productHandle}.`
      )
    }

    let rulesRecommendations
    try {
      const merchandisingRulesData = await axios.get(
        `https://${nacelleStaticUrl}/${process.env.nacelleSpaceID}/merchandising-rules.json`
      )
      const merchandisingRules = merchandisingRulesData.data.rules.find(rule =>
        rule.inputs.includes(productHandle)
      )
      rulesRecommendations = merchandisingRules
        ? merchandisingRules.outputs
        : []
    } catch (error) {
      console.log(
        `Unable to load product recommendation rules for ${productHandle}.`
      )
    }

    const recommendations = [
      ...(generatedRecommendations || []).map(handle => ({
        handle,
        source: 'generated'
      })),
      ...(rulesRecommendations || []).map(handle => ({
        handle,
        source: 'rule'
      }))
    ]

    if (!recommendations || !recommendations.length) {
      return
    }

    recommendations.map(({ handle }) => {
      dispatch('loadProduct', { productHandle: handle })
    })

    const productUpdate = {
      product: {
        handle: productHandle
      },
      recommendations
    }

    commit('upsertProducts', [productUpdate])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
