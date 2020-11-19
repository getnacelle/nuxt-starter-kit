const findSelectedVariant = (state, options) => {
  options = options || state.selectedOptions
  if (options.length === 0) {
    return state.product.variants[0]
  } else {
    return state.product.variants.find((variant) => {
      return options.every((option) => {
        return variant.selectedOptions.some(variantOption => JSON.stringify(variantOption) === JSON.stringify(option))
      })
    })
  }
}

export default {
  state: () => {
    return {
      product: {},
      selectedOptions: []
    }
  },
  getters: {
    selectedVariant: (state) => findSelectedVariant(state)
  },
  mutations: {
    setProduct: (state, product) => {
      state.product = product
    },
    setSelected: (state, selectedOption) => {
      if (state.selectedOptions.length === 0) {
        state.selectedOptions.push(selectedOption)
      } else {
        const index = state.selectedOptions.findIndex((item) => item.name === selectedOption.name)
        if (index === -1) {
          state.selectedOptions.push(selectedOption)
          return
        }

        state.selectedOptions.splice(index, 1, selectedOption)

        // - - -
        // after updating `selectedOptions` test if a variant matches
        const selectedVariant = findSelectedVariant(state)

        // if matching variant is not found
        // then set `selectedOptions` to the first variant found with `selectedOption`
        if (!selectedVariant) {
          const matchingVariant = findSelectedVariant(state, [selectedOption])
          state.selectedOptions = matchingVariant.selectedOptions
            .map(({ name, value }) => ({ name, value }))
        }
      }
    }
  },
  namespaced: true
}
