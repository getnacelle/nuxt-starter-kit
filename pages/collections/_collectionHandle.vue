<!--
/****
/* For information about creating collections, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/collections.html#adding-content-to-collections-pages
/****
-->
<template>
  <div class="page page-collection" v-if="collection">
    <content-hero-banner
      v-if="collection && collection.title && collection.featuredImage"
      :title="collection.title"
      :imageUrl="collection.featuredImage"
    />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <product-grid
            v-if="collection.products && collection.products.length > 0"
            :products="visibleProducts"
            :showAddToCart="true"
            :showQuantityUpdate="true"
          />
        </div>
      </div>
      <observe-emitter v-on:observe="showMore" />
      <div v-if="isFetching" style="text-align: center">
        Loading products...
      </div>
    </section>
  </div>
</template>

<script>
import viewEvent from '~/mixins/viewEvent'

export default {
  mixins: [
    viewEvent('collection')
  ],
  data() {
    return {
      collection: null,
      productVisibilityCount: 16,
      fetchBuffer: 16,
      isFetching: false
    }
  },
  computed: {
    visibleProducts() {
      if (this.collection.products) {
        return this.collection.products.slice(0, this.productVisibilityCount)
      }
      return null
    }
  },
  async fetch() {
    const collectionData = await this.$nacelle.data.collection({
      handle: this.$route.params.collectionHandle
    })
    this.collection = { products: [], ...collectionData }
    this.collection.products = await this.fetchProducts(0, this.productVisibilityCount + this.fetchBuffer)
  },
  methods: {
    showMore() {
      if (!this.collection) {
        return
      }
      const currentCount = this.productVisibilityCount
      const fetchCursor = currentCount + this.fetchBuffer
      this.productVisibilityCount = currentCount + 16
      this.fetchProducts(fetchCursor, fetchCursor + 16)
    },
    async fetchProducts(start, end) {
      this.isFetching = true

      const products = this.collection.productLists[0].handles
        .slice(start, end)
        .map(handle => this.$nacelle.data.product({ handle }))
      const collectionProducts = await Promise.all(products)
      const filteredProducts = collectionProducts.filter(Boolean)
      this.isFetching = false

      return [
        ...this.collection.products,
        ...filteredProducts
      ]
    }
  }
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
.page-collection {
  min-height: 85vh;
}
.product {
  .title {
    font-weight: bold;
  }
  img {
    width: 250px;
  }
}
</style>
