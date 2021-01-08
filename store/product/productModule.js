import localforage from 'localforage'
import flattenDeep from 'lodash/flattenDeep'
// import uniq from 'lodash/uniq'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'

const findSelectedVariant = (state, options) => {
  options = options || state.selectedOptions
  if (options.length === 0) {
    return state.product.variants[0]
  } else {
    return state.product.variants.find((variant) => {
      return options.every((option) => {
        return variant.selectedOptions
          .some(variantOption => JSON.stringify(variantOption) === JSON.stringify(option))
      })
    })
  }
}

export default () => {
  return {
    state: () => {
      return {
        product: null,
        selectedOptions: [],
        selectedVariant: null,
        options: []
      }
    },
    actions: {
      async fetchProduct({ state, commit }, handle) {
        const namespace = `product/${handle}`
        let product

        if (process.client) {
          product = await localforage.getItem(namespace)
          if (!product) {
            product = await this.$nacelle.data.product({ handle })
            localforage.setItem(namespace, product)
          }
        } else {
          product = await this.$nacelle.data.product({ handle })
        }
        commit('setProduct', product)
        commit('setOptions')

        // set a preselected variant
        commit('setSelectedVariant', findSelectedVariant(state))

        return product
      },
      async storeProduct({ state }, product, doOverwrite = true) {
        const namespace = `product/${product.handle}`
        const storedProduct = await localforage.getItem(namespace)

        // TODO: time limit to force overwrite?
        if (!storedProduct || doOverwrite) {
          localforage.setItem(namespace, product)
        }
      },
      setSelected({ state, commit }, selectedOption) {
        commit('setSelected', selectedOption)
        commit('setSelectedVariant', findSelectedVariant(state))
      }
    },
    mutations: {
      setProduct: (state, product) => {
        state.product = product
      },
      setOptions: (state) => {
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

        const optionNames = [...new Set(
          flattenedOptions.map(option => option.name)
        )]
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

        state.options = optionValuesByName
      },
      setSelectedVariant: (state, selectedVariant) => {
        state.selectedVariant = selectedVariant
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
}
