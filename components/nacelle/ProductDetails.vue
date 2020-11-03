<template>
  <div class="product columns">
    <div class="column is-6">
      <product-media-select-view
        v-if="product && product.featuredMedia && product.media"
        :featuredMedia="product.featuredMedia"
        :media="product.media"
      />
    </div>
    <div class="column is-5 is-offset-1">
      <product-title :title="product.title" />
      <product-category
        v-if="product.productType"
        :category="product.productType"
      />
      <p class="price">
        <product-price  :price="product.price" />
      </p>
      <product-description :description="product.description" />
      <product-variant-select
      :product="product"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ProductCategory from '~/components/nacelle/ProductCategory'
import ProductMediaSelectView from '~/components/nacelle/ProductMediaSelectView'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
import ProductDescription from '~/components/nacelle/ProductDescription'
import ProductVariantSelect from '~/components/nacelle/ProductVariantSelect'

export default {
  components: {
    ProductCategory,
    ProductMediaSelectView,
    ProductTitle,
    ProductPrice,
    ProductDescription,
    ProductVariantSelect
  },
  data() {
    return {}
  },
  props: {
    product: {
      type: Object
    }
  },
  computed: {
    ...mapState('user', ['locale'])
  },
  methods: {
    ...mapMutations('cart', ['showCart'])
  }
}
</script>

<style lang="scss" scoped>
.price {
  margin-bottom: 1rem;
}
</style>
