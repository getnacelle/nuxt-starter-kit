<template>
  <product-grid :products="products"/>
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
    const products = collectionData.productLists[0].handles.map(handle => {
      return vm.$nacelle.data.product({ handle: handle })
    })
    this.products = await Promise.all(products)
  }
}
</script>

<style>

</style>
