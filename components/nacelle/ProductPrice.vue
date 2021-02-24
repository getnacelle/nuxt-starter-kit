<template>
  <span class="product-price nacelle">{{ price }}</span>
</template>

<script>
export default {
  props: {
    price: {
      type: [String, Number],
      default: ''
    },
    currencyCode: {
      type: String,
      default: 'USD'
    },
    showCurrencyCode: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.product-price {
  margin-bottom: 1rem;
}
</style>
