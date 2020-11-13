<template>
  <div>
    <button
      :disabled="buttonState === 'disabled'"
      @click="addToCart"
      class="button is-primary"
    >
      <slot>
        <span>{{ buttonText }}</span>
      </slot>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  props: {
    product: {
      type: Object
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    },
    quantity: { type: Number, default: 1 },
    variant: { type: Object }
  },
  data() {
    return { buttonState: 'enabled' }
  },

  computed: {
    ...mapState('cart', ['lineItems']),
    buttonText() {
      const variantInLineItems =
        !!this.variant &&
        this.lineItems.map(l => l.variant.id).includes(this.variant.id)
      if (variantInLineItems) {
        return 'Added!'
      }
      if (
        (!this.variantInLineItems &&
          this.variant &&
          !this.variant.availableForSale) ||
        !this.product.availableForSale
      ) {
        return 'Out of Stock'
      }
      return 'Add To Cart'
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
      if (this.variant.availableForSale) {
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
