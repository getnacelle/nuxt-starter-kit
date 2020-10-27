<template>
  <div class="variant-select nacelle">
    <product-options
      v-show="showProductOptions"
    />
    <slot name="above-button"></slot>
    <div class="columns is-mobile">
      <div v-if="showQuantitySelect" class="column auto">
        <quantity-selector :quantity.sync="quantity" />
      </div>
      <div class="column auto">
        <product-add-to-cart-button
          :quantity="quantity"
        />
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
    }
  },
  data() {
    return {
      quantity: 1
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
