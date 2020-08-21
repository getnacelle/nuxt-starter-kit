import Vue from 'vue'
import deepmerge from 'deepmerge'
import uniqWith from 'lodash.uniqwith'
import isEqual from 'lodash.isequal'

const defaultProductData = {
  product: {
    priceRange: {
      min: '0.0',
      max: '0.00',
      currencyCode: 'USD'
    },
    title: null,
    media: [],
    featuredMedia: {
      src: undefined
    },
    id: null,
    handle: '',
    variants: []
  },
  selectedVariantId: undefined,
  selectedOptions: [],
  metafields: [],
  quantity: 1
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
  getPriceForCurrency: (state, getters, rootState) => ({
    productHandle,
    fallbackPrice
  }) => {
    const productData = state.products[productHandle]
    if (!productData || !productData.product) {
      return
    }

    const { product } = productData
    const { variants, priceRange } = product
    const { locale, currency } = rootState.user.locale

    if (priceRange.currencyCode === currency) {
      return new Intl.NumberFormat(product.locale, {
        style: 'currency',
        currency: priceRange.currencyCode
      }).format(fallbackPrice)
    }

    const priceForCurrency = Math.max(
      0,
      ...variants
        .filter(!!variant.priceRules)
        .map(variant =>
          variant.priceRules
            .filter(priceRule.priceCurrency === currency)
            .map(priceRule => priceRule.price)
        )
        .flat()
    )

    const currencyToDisplay = {
      locale: priceForCurrency ? locale : product.locale,
      currency: priceForCurrency ? currency : priceRange.currencyCode,
      price: priceForCurrency || fallbackPrice
    }

    const formattedCurrency = new Intl.NumberFormat(currencyToDisplay.locale, {
      style: 'currency',
      currency: currencyToDisplay.currency
    }).format(currencyToDisplay.price)

    return priceForCurrency
      ? `${formattedCurrency} ${currency}`
      : formattedCurrency
  },
  getSelectedOptions: state => handle => {
    const productData = state.products[handle]
    if (!productData) {
      return []
    }

    return productData.selectedOptions || []
  },
  getAllOptions: state => handle => {
    const productData = state.products[handle]
    if (!productData) {
      return []
    }

    const {
      product: { variants }
    } = productData

    if (!variants) {
      return
    }

    const flattenedOptions = variants
      .filter(v => !!v.selectedOptions)
      .map(v => v.selectedOptions)
      .map(s =>
        s.map(option =>
          option.name === 'Color'
            ? {
                name: option.name,
                value: option.value,
                swatchSrc: variant.swatchSrc
              }
            : option
        )
      )
      .flat()

    const optionNames = [...new Set(flattenedOptions.map(o => o.name))]

    const optionValuesByName = optionNames.map(name => {
      const values = uniqWith(
        flattenedOptions
          .filter(o => o.name === name)
          .map(option => ({
            value: option.value,
            ...(option.swatchSrc && { swatchSrc: option.swatchSrc })
          })),
        isEqual
      )

      return {
        name,
        values
      }
    })

    return optionValuesByName
  },
  onlyOneOption: (state, getters) => handle => {
    const allOptions = getters.getAllOptions(handle)
    return (
      allOptions && allOptions.length === 1 && allOptions[0].values.length === 1
    )
  },
  allOptionsSelected: (state, getters) => handle => {
    const productData = state.products[handle]
    if (!productData) {
      return false
    }
    const {
      product: { variants },
      selectedOptions
    } = productData

    if (variants && variants.length === 1) {
      return true
    }

    const allOptions = getters.getAllOptions(handle)
    if (
      allOptions &&
      selectedOptions &&
      selectedOptions.length === allOptions.length
    ) {
      return true
    }

    if (
      allOptions &&
      allOptions.length === 1 &&
      allOptions[0].values.length === 1
    ) {
      return true
    }

    return false
  },
  getProductData: state => handle => {
    const productData = state.products[handle] || defaultProductData
    return productData
  },
  getSelectedVariant: state => handle => {
    const productData = state.products[handle] || defaultProductData
    const {
      product: { variants },
      selectedVariantId
    } = productData

    if (selectedVariantId) {
      return variants.find(
        variant => variant.id === productData.selectedVariantId
      )
    }

    if (variants && variants.length) {
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

  clearSelectedOptions(state, productHandle) {
    const productData = state.products[productHandle]
    if (!productData) {
      return
    }

    state.products = {
      ...state.products,
      [productHandle]: {
        ...state.products[productHandle],
        selectedOptions: []
      }
    }
  },

  setSelectedOption(state, { productHandle, option }) {
    const productData = state.products[productHandle]
    if (!productData) {
      return
    }

    const {
      product: { variants },
      selectedOptions
    } = productData

    const isValidOption = option && option.name

    const newSelectedOptions = isValidOption
      ? [...selectedOptions.filter(o => o.name !== option.name), option]
      : selectedOptions

    state.products = {
      ...state.products,
      [productHandle]: {
        ...state.products[productHandle],
        selectedOptions: newSelectedOptions
      }
    }

    const stringifiedOptions = newSelectedOptions.map(o => JSON.stringify(o))

    const variantMatch = variants.find(v =>
      v.selectedOptions.every(o =>
        stringifiedOptions.includes(JSON.stringify(o))
      )
    )

    state.products = {
      ...state.products,
      [productHandle]: {
        ...state.products[productHandle],
        ...(variantMatch && { selectedVariantId: variantMatch.id })
      }
    }
  },

  setSelectedVariant(state, { productHandle, variantId }) {
    const productData = state.products[productHandle]
    if (
      !productData ||
      !productData.product ||
      !productData.product.variants ||
      !variantId ||
      !productData.product.variants.map(v => v.id).includes(variantId)
    ) {
      return
    }

    state.products = {
      ...state.products,
      [productHandle]: {
        ...state.products[productHandle],
        selectedVariantId: variantId
      }
    }
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
