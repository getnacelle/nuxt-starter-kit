<template>
  <div class="product-recommendations">
    <div v-for="handle in recommendations" :key="handle">
      <slot :productHandle="handle">
        <!-- <product-card :productHandle="handle"></product-card> -->
        <span>{{ handle }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductCard from '~/components/nacelle/ProductCard'

export default {
  components: {
    ProductCard
  },
  props: {
    productHandle: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('products', ['getRecommendations']),
    recommendations() {
      return this.getRecommendations(this.productHandle)
    }
  },
  methods: {
    ...mapActions('products', ['loadProductRecommendations'])
  },
  created() {
    this.loadProductRecommendations({ productHandle: this.productHandle })
  }
}
</script>

<style lang="scss" scoped>
.product-recommendations {
}
</style>
