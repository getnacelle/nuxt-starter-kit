<template>
  <div class="variant-select nacelle">
    <product-options
      v-if="product.variants.length > 1"
      :variants="product.variants"
      :productId="product.pimSyncSourceProductId"
    >
      <template v-slot:swatch="{option, variants}">
        <product-option-swatch
          v-for="{ value } in option.values"
          :key="value"
          v-bind="{ value, optionName: option.name, variants, globalHandle: product.globalHandle }"
          swatch-style="tab"
        />
      </template>
    </product-options>

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
        />
      </div>
    </div>
  </div>
</template>

<script>
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
    selectedVariant() {
      return this.$store.getters[`product/${this.product.globalHandle}/selectedVariant`] || null
    }
  }
}
</script>

<style></style>
