<template>
  <div class="product-card nacelle">
    <router-link :to="`${pathFragment}${product.handle}`">
      <product-image :source="mediaSrc" :width="300" :height="300" />
    </router-link>
    <div class="product-card-details">
      <router-link :to="`${pathFragment}${product.handle}`">
        <product-title :title="product.title" />
      </router-link>
      <product-price :price="displayPrice" />
    </div>
    <product-options
      v-if="product.variants.length > 1"
      :variants="product.variants"
      :productId="product.pimSyncSourceProductId"
    >
      <template v-slot:swatch="{option, variants}">
        <product-option-swatch
          v-for="{ value } in option.values"
          :key="value"
          v-bind="{ value, variants, optionName: option.name, globalHandle: product.globalHandle }"
          swatch-style="tab"
        />
      </template>
    </product-options>
    <div v-if="product && product.id && productStoreRegistered" class="product-card-actions">
      <quantity-selector
        v-if="showQuantityUpdate === true"
        :quantity.sync="quantity"
      />
      <product-add-to-cart-button
        v-if="showAddToCart === true"
        :product="product"
        :variant="selectedVariant"
        :quantity="quantity"
      ></product-add-to-cart-button>
      <product-add-to-wishlist-button
        class="circle-button is-primary"
        :variant="selectedVariant"
        :product="product"
      >
        <template v-slot:icon></template>
      </product-add-to-wishlist-button>
    </div>
  </div>
</template>

<script>
import productModule from '~/store/product/productModule'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import getDisplayPriceForCurrency from '~/mixins/getDisplayPriceForCurrency'

export default {
  mixins: [getDisplayPriceForCurrency],
  props: {
    pathFragment: {
      type: String,
      default: '/products/'
    },
    product: {
      type: Object,
      default: () => {
        return {
          priceRange: {
            min: '0.0',
            max: '0.00'
          },
          title: null,
          featuredMedia: {
            src: undefined
          },
          id: null,
          handle: '',
          variants: []
        }
      }
    },
    showQuantityUpdate: {
      type: Boolean,
      default: true
    },
    showAddToCart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      quantity: 1
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),
    ...mapState('user', ['locale']),
    ...mapGetters('cart', ['quantityTotal']),

    productStoreRegistered() {
      return this.$store.hasModule(['product', this.product.globalHandle])
    },
    selectedVariant() {
      return this.$store.getters[`product/${this.product.globalHandle}/selectedVariant`] || null
    },
    displayPrice() {
      if (this.selectedVariant) {
        return this.getPriceForCurrency({
          product: this.product,
          fallbackPrice: this.selectedVariant.price
        })
      }
      return null
    },
    mediaSrc() {
      if (
        this.product.featuredMedia &&
        this.product.featuredMedia &&
        this.product.featuredMedia.src
      ) {
        return this.product.featuredMedia.src
      }

      return undefined
    },
    cartProduct() {
      return {
        image: this.product.featuredMedia,
        title: this.product.title,
        productId: this.product.id,
        price: this.currentPrice,
        handle: this.product.handle,
        variant: this.selectedVariant
      }
    },
    productLineItems() {
      return this.lineItems.filter(item => {
        return item.productId === this.product.id
      })
    }
  },
  created() {
    const { product } = this
    if (!this.productStoreRegistered) {
      this.$store.registerModule(['product', product.globalHandle], productModule({ product }))
    }
  },

  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView'])
  }
}
</script>

<style lang="scss" scoped>
.product-card-details,
.product-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
}

.product-card-details /deep/ a {
  flex-basis: 80%;
}

.handler {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
