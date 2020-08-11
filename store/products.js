import axios from 'axios'
import Vue from 'vue'
import * as deepmerge from 'deepmerge'

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
  getRecommendations: state => handle => {
    const productData = state.products[handle] || defaultProductData
    return productData.recommendations
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
    { state, dispatch, commit },
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

    const recommendationsData = await axios.get(
      'https://nacellestatic-dev.s3.amazonaws.com/6789/merchandising/products/commander-sofa--en-us.json'
    )
    const recommendations = JSON.parse(recommendationsData.data)
    if (!recommendations || !recommendations.length) {
      return
    }

    await Promise.all(
      recommendations.map(async handle => {
        await dispatch('loadProduct', { productHandle: handle })
      })
    )

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
