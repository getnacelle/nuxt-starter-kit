<template>
  <div class="variant-select nacelle">
    <product-options
    v-if="product.variants.length > 1"
          :selectedVariant="selectedVariant"
      :variants="product.variants"
      :productId="product.pimSyncSourceProductId"
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
import { mapGetters, mapMutations } from 'vuex'
import ProductOptions from '~/components/nacelle/ProductOptions'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'

export default {
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
  created() {
    const vm = this
    if (!this.$store.hasModule(this.product.pimSyncSourceProductId)) {
      this.$store.registerModule(this.product.pimSyncSourceProductId, {
        state: () => {
          return { selectedOptions: [] }
        },
        getters: {
          selectedVariant: (state) => {
            if (state.selectedOptions.length === 0) {
              return vm.product.variants[0]
            } else {
              return vm.product.variants.find((variant) => {
                return state.selectedOptions.every((option) => {
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
                console.log(index)
                state.selectedOptions[index].value = selectedOption.value
              } else {
                state.selectedOptions.push(selectedOption)
              }
            } else {
              state.selectedOptions.push(selectedOption)
            }
          }
        },
        namespaced: true
      })
    }
  },
  computed: {
    selectedVariant() {
      if (this.$store.getters[[`${this.product.pimSyncSourceProductId}/selectedVariant`]]) {
        return this.$store.getters[`${this.product.pimSyncSourceProductId}/selectedVariant`]
      }
      return null
    }
  },
  components: {
    ProductOptions,
    QuantitySelector,
    ProductAddToCartButton

  }
}
</script>

<style></style>
