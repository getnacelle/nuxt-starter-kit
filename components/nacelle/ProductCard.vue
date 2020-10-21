<template>
  <div class="product-card nacelle">
    <router-link :to="`${pathFragment}${product.handle}`">
      <product-image :source="mediaSrc" />
    </router-link>
    <div class="product-card-details">
      <router-link :to="`${pathFragment}${product.handle}`">
        <product-title :title="product.title" />
      </router-link>
      <product-price :price="displayPrice" />
    </div>
    <product-options
      v-if="product.variants.length > 1"
      :options="allOptions"
      :selectedVariant="selectedVariant"
      :variants="product.variants"
      :productId="product.pimSyncSourceProductId"
    />
    <div v-if="product && product.id" class="product-card-actions">
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
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import availableOptions from '~/mixins/availableOptions'
import getDisplayPriceForCurrency from '~/mixins/getDisplayPriceForCurrency'

export default {
  mixins: [availableOptions, getDisplayPriceForCurrency],
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
    selectedVariant() {
      if (this.$store.getters[[`${this.product.pimSyncSourceProductId}/selectedVariant`]]) {
        return this.$store.getters[`${this.product.pimSyncSourceProductId}/selectedVariant`]
      }
      return null
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
      const vm = this
      return this.lineItems.filter(item => {
        return item.productId === vm.product.id
      })
    }
  },
  created() {
    const vm = this
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
