<template>
  <div class="variant-select nacelle">
    <product-options
      v-if="product.variants.length > 1"
      :selectedVariant="selectedVariant"
      :variants="product.variants"
      :productId="pimId"
    />
    <slot name="above-button"></slot>
    <div class="columns is-mobile">
      <div v-if="showQuantitySelect" class="column auto">
        <quantity-selector :quantity.sync="quantity" />
      </div>
      <div class="column auto">
      <product-add-to-cart-button
        :product="product"
        :variant="selectedVariant"
        :quantity="quantity"
      ></product-add-to-cart-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapMutations } from 'vuex'
import { mapGetters, mapMutations } from 'vuex'

import ProductOptions from '~/components/nacelle/ProductOptions'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'

export default {
  components: {
    ProductOptions,
    QuantitySelector,
    ProductAddToCartButton
  },
  props: {
    showQuantitySelect: {
      type: Boolean,
      default: true
    },
    product: {
      type: Object
    }
  },
  data() {
    return {
      quantity: 1
    }
  },
  computed: {
    pimId() {
      return this.product.pimSyncSourceProductId
    },
    selectedVariant() {
      return this.$store.getters[`product/${this.pimId}/selectedVariant`]
    }
  },
  created() {
    // createProductModule(this.product)

    const { product } = this
    if (!this.$store.hasModule(['product', this.pimId])) {
      this.$store.registerModule(['product', this.pimId], {
        state: () => {
          return { selectedOptions: [] }
        },
        getters: {
          selectedVariant: (state) => {
            if (state.selectedOptions.length === 0) {
              return product.variants[0]
            } else {
              return product.variants.find(variant => {
                return state.selectedOptions.every(option => {
                  return variant.selectedOptions.some(variantOption => JSON.stringify(variantOption) === JSON.stringify(option))
                })
              })
            }
          }
        },
        mutations: {
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

            // if `selectedOptions` does not match any variant
            // then select remove options until matching variant based on `selectedOption`
            const findSelectedVariant = () => product.variants.find(variant => {
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
      })
    }
  }
}
</script>

<style></style>
