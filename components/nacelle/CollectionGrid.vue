<template>
  <div>
    <h3>{{ title }}</h3>
    <product-grid :products="products" />
  </div>
</template>

<script>
export default {
  props: {
    collectionHandle: { type: String },
    itemsToShow: { type: Number },
    title: { type: String }
  },
  data() {
    return {
      products: null
    }
  },
  async fetch() {
    const vm = this
    const collectionData = await this.$nacelle.data.collection({
      handle: this.collectionHandle
    })
    const products = collectionData.productLists[0].handles.slice(0, this.itemsToShow).map(handle => {
      return vm.$nacelle.data.product({ handle: handle })
    })
    this.products = await Promise.all(products)
  }
}
</script>

<style>

</style>
