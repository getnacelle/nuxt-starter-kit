export default {
  state: () => {
    return {
      product: {},
      selectedOptions: []
    }
  },
  getters: {
    selectedVariant: (state) => {
      if (state.selectedOptions.length === 0) {
        return state.product.variants[0]
      } else {
        return state.product.variants.find((variant) => {
          return state.selectedOptions.every((option) => {
            return variant.selectedOptions.some(variantOption => JSON.stringify(variantOption) === JSON.stringify(option))
          })
        })
      }
    }
  },
  mutations: {
    setProduct: (state, product) => {
      state.product = product
    },
    setSelected: (state, selectedOption) => {
      if (state.selectedOptions.length > 0) {
        const index = state.selectedOptions.findIndex((item) => item.name === selectedOption.name)
        if (index > -1) {
          state.selectedOptions[index].value = selectedOption.value
        } else {
          state.selectedOptions.push(selectedOption)
        }
      } else {
        state.selectedOptions.push(selectedOption)
      }

      // - - -
      // if `selectedOptions` does not match any variant
      // then select remove options until matching variant based on `selectedOption`
      const findSelectedVariant = () => state.product.variants.find(variant => {
        return state.selectedOptions.every(option => {
          return variant.selectedOptions.some(variantOption => JSON.stringify(variantOption) === JSON.stringify(option))
        })
      })
      let selectedVariant = findSelectedVariant()
      while (!selectedVariant && state.selectedOptions.length > 0) {
        state.selectedOptions.shift()
        selectedVariant = findSelectedVariant()
      }
    }
  },
  namespaced: true
}
