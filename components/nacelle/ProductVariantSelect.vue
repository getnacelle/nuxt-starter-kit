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
import productModule from '~/store/product/productModule'
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
    if (!this.$store.hasModule(['product', this.pimId])) {
      this.$store.registerModule(['product', this.pimId], productModule)
      this.$store.commit(
        `product/${this.pimId}/setProduct`,
        this.product,
        { root: true }
      )
    }
  }
}
</script>

<style></style>
