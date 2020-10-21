<!--
/****
/* For information about creating collections, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/collections.html#adding-content-to-collections-pages
/****
-->
<template>
  <div class="page page-shop" v-if="collection">
    <content-hero-banner
      v-if="collection && collection.title && featuredImage"
      :title="collection.title"
      :imageUrl="featuredImage"
    />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <product-grid
            v-if="collection.products && collection.products.length > 0"
            :products="collection.products"
            :showAddToCart="true"
            :showQuantityUpdate="true"
          />
        </div>
      </div>
      <!-- <observe-emitter v-on:observe="fetchMore" /> -->
    </section>
  </div>
</template>

<script>
import viewEvent from '~/mixins/viewEvent'
export default {
  data() {
    return {
      collection: null
    }
  },
  async fetch() {
    const vm = this
    const collectionData = await this.$nacelle.data.collection({
      handle: this.$route.params.collectionHandle
    })
    const products = collectionData.productLists[0].handles.map(handle => {
      return vm.$nacelle.data.product({ handle: handle })
    })
    const collectionProducts = await Promise.all(products)
    this.collection = { products: collectionProducts, ...collectionData }
  },
  mixins: [
    viewEvent('collection')
  ]
  // head() {
  //   if (this.collection) {
  //     const properties = {}
  //     const meta = []
  //     const title = this.getMetatag('title')

  //     if (this.collection.title) {
  //       let fullTitle = this.collection.title

  //       if (title) {
  //         fullTitle = `${fullTitle} | ${title.value}`
  //       }

  //       properties.title = fullTitle
  //       meta.push({
  //         hid: 'og:title',
  //         property: 'og:title',
  //         content: fullTitle
  //       })
  //     }

  //     if (this.collection.description) {
  //       meta.push({
  //         hid: 'description',
  //         name: 'description',
  //         content: this.collection.description
  //       })
  //       meta.push({
  //         hid: 'og:description',
  //         property: 'og:description',
  //         content: this.collection.description
  //       })
  //     }

  //     if (this.featuredImage) {
  //       meta.push({
  //         hid: 'og:image',
  //         property: 'og:image',
  //         content: this.featuredImage
  //       })
  //     }

  //     return {
  //       ...properties,
  //       meta
  //     }
  //   }
  // }
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
