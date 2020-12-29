<template>
  <product-grid :products="products"/>
</template>

<script>
import productModule from '~/store/product/productModule'

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
    const collectionData = await this.$nacelle.data.collection({
      handle: this.collectionHandle
    })
    const products = collectionData.productLists[0].handles.map(handle => {
      const namespace = `product/${handle}`
      if (!this.$store.hasModule(namespace)) {
        this.$store.registerModule(namespace, productModule(), { preserveState: false })
      }
      return this.$store.dispatch(`${namespace}/fetchProduct`, handle)
    })
    this.products = await Promise.all(products)
  },
  mounted() {
    // store products loaded during SSR fetch into localforage (indexedDB)
    if (this.products) {
      this.products.forEach((product) => {
        const namespace = `product/${product.handle}`
        this.$store.dispatch(`${namespace}/storeProduct`, product)
      })
    }
  }
}
</script>

<style>

</style>
