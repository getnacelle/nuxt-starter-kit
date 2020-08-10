<template>
  <div class="product-recommendations">
    <div v-for="productHandle in productHandles" :key="productHandle">
      <slot :productHandle="productHandle">
        <span>{{ productHandle }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
  async asyncData(context) {
    const { store } = context
    console.log('context', context)
    await store.dispatch('loadProductRecommendations', { productHandle })
  }
}
</script>

<style lang="scss" scoped>
.product-recommendations {
}
</style>
