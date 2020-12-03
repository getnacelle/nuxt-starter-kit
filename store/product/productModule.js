import flattenDeep from 'lodash/flattenDeep'
import uniq from 'lodash/uniq'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'

const findSelectedVariant = (state, options) => {
  // -- race condition?
  if (!state || !state.product) {
    return null
  }

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

export default ({ product }) => ({
  state: () => {
    return {
      product,
      selectedOptions: []
    }
  },
  getters: {
    selectedVariant: (state) => findSelectedVariant(state),

    options(state) {
      if (!state || !state.product || !state.product.variants) {
        return []
      }

      const nestedOptions = state.product.variants.map(variant => {
        if (variant.selectedOptions) {
          return variant.selectedOptions.map(option => {
            if (option.name === 'Color') {
              return {
                name: option.name,
                value: option.value,
                swatchSrc: variant.swatchSrc
              }
            }

            return option
          })
        }

        return []
      })
      const flattenedOptions = flattenDeep(nestedOptions)

      const optionNames = uniq(
        flattenedOptions.map(option => {
          return option.name
        })
      )
      const optionValuesByName = optionNames.map(name => {
        const values = uniqWith(
          flattenedOptions
            .filter(option => option.name === name)
            .map(option => {
              if (option.swatchSrc) {
                return { value: option.value, swatchSrc: option.swatchSrc }
              } else {
                return { value: option.value }
              }
            }),
          isEqual
        )

        return {
          name,
          values
        }
      })

      return optionValuesByName
    }
  },
  mutations: {
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
})
