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
  currentProduct: state => {
    return state.products[state.currentProductHandle]
  },
  getProductData: state => handle => {
    return state.products[handle] || defaultProductData
  },
  currentVariant: state => handle => {
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

      state.products[handle] = { ...existingProductData, ...productData }
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

export const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
