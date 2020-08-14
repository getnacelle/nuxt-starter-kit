<template>
  <div>
    <button
      :disabled="disableAtcButton"
      @click="addToCart"
      class="button is-primary"
    >
      <slot>
        <span v-if="showSelectOptions">Select Options</span>
        <span v-if="showAddToCart">Add to Cart</span>
        <span v-if="showOutOfStock">Out of Stock</span>
        <span v-if="variantInLineItems">Added!</span>
      </slot>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    productHandle: {
      type: String,
      default: ''
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    },

    quantity: { type: Number, default: 1 },
    allOptionsSelected: { type: Boolean, default: false },
    confirmedSelection: { type: Boolean, default: false }
  },

  computed: {
    ...mapState('cart', ['lineItems']),
    ...mapGetters('products', [
      'getProduct',
      'getSelectedVariant',
      'onlyOneOption'
    ]),

    product() {
      return this.getProduct(this.productHandle)
    },

    variant() {
      return this.getSelectedVariant(this.productHandle)
    },

    variantInLineItems() {
      return (
        !!this.variant &&
        this.lineItems.map(l => l.variant.id).includes(this.variant.id)
      )
    },

    isProductVariantSelectChild() {
      return this.$parent.$options._componentTag === 'product-variant-select'
    },

    showSelectOptions() {
      return this.isProductVariantSelectChild
        ? !this.variantInLineItems &&
            !this.allOptionsSelected &&
            this.product.availableForSale
        : !this.onlyOneOption(this.productHandle) &&
            this.product.availableForSale
    },

    disableAtcButton() {
      return (
        !this.allOptionsSelected ||
        (this.allOptionsSelected && this.variant === undefined) ||
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          !this.variant.availableForSale)
      )
    },

    showOutOfStock() {
      return (
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          this.variant &&
          !this.variant.availableForSale) ||
        !this.product.availableForSale
      )
    },

    showAddToCart() {
      return (
        (this.isProductVariantSelectChild
          ? this.allOptionsSelected
          : this.onlyOneOption(this.productHandle)) &&
        !this.variantInLineItems &&
        this.variant &&
        this.variant.availableForSale
      )
    }
  },

  watch: {
    confirmedSelection() {
      this.addToCart()
    }
  },

  methods: {
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),

    ...mapMutations('cart', ['showCart']),

    addToCart() {
      if (this.allOptionsSelected && this.product.availableForSale) {
        const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant: this.variant,
          quantity: this.quantity || 1,
          productId: this.product.id,
          handle: this.product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          metafields: this.metafields
        }
        this.addLineItem(lineItem)
        this.showCart()
      }
    }
  }
}
</script>
