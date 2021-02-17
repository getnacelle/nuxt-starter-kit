<template>
  <div class="page page-shop">
    <content-hero-banner title="Wishlist" />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <product-grid
            v-if="products && products.length > 0"
            :products="products"
            :show-add-to-cart="true"
            :show-quantity-update="true"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('wishlist', ['items']),
    products() {
      return this.items.map((item) => item.product)
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  .title {
    font-weight: bold;
  }
  img {
    width: 250px;
  }
}
</style>
