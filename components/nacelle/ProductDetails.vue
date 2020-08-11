<template>
  <div class="product columns">
    <div class="column is-6">
      <product-media-select-view
        v-if="product && product.featuredMedia && product.media"
        :featuredMedia="product.featuredMedia"
        :media="product.media"
      />
      <h2>Related Products</h2>
      <product-recommendations
        :productHandle="productHandle"
        :maxToShow="3"
        :orientation="'horizontal'"
        v-slot:default="{ product }"
      >
        <!-- <span>{{ product.title }}</span> -->
      </product-recommendations>
    </div>
    <div class="column is-5 is-offset-1">
      <product-title :title="product.title" />
      <!-- <product-add-to-cart-button
        :product="product"
        :variant="selectedVariant"
        :allOptionsSelected="true"
        :onlyOneOption="true"
        :metafields="[{key:'test', value:'hi'}]"
      />-->
      <product-category
        v-if="product.productType"
        :category="product.productType"
      />
      <p class="price">
        <product-price v-if="selectedVariant" :price="displayPrice" />
      </p>
      <product-description :description="product.description" />
      <product-variant-select
        v-if="selectedVariant"
        :product="product"
        :variant="selectedVariant"
        v-on:variant-selected="onVariantSelected"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ProductCategory from '~/components/nacelle/ProductCategory'
import ProductMediaSelectView from '~/components/nacelle/ProductMediaSelectView'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
import ProductDescription from '~/components/nacelle/ProductDescription'
import ProductVariantSelect from '~/components/nacelle/ProductVariantSelect'
import getDisplayPriceForCurrency from '~/mixins/getDisplayPriceForCurrency'
import ProductRecommendations from '~/components/nacelle/ProductRecommendations'

export default {
  components: {
    ProductCategory,
    ProductMediaSelectView,
    ProductTitle,
    ProductPrice,
    ProductDescription,
    ProductVariantSelect,
    ProductRecommendations
  },
  mixins: [getDisplayPriceForCurrency],
  data() {
    return {}
  },
  props: {
    productHandle: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('user', ['locale']),
    ...mapGetters('products', ['getProduct', 'getSelectedVariant']),
    product() {
      return this.getProduct(this.productHandle)
    },
    displayPrice() {
      return this.getPriceForCurrency({
        product: this.product,
        fallbackPrice: this.selectedVariant.price
      })
    },
    selectedVariant() {
      return this.getSelectedVariant(this.productHandle)
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapMutations('products', ['setSelectedVariant']),
    onVariantSelected({ selectedVariant }) {
      this.setSelectedVariant({
        productHandle: this.productHandle,
        variantId: selectedVariant.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.price {
  margin-bottom: 1rem;
}
</style>
