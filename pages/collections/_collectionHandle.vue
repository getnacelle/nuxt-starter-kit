<!--
/****
/* For information about creating collections, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/collections.html#adding-content-to-collections-pages
/****
-->
<template>
  <div
    v-if="collection"
    class="page page-collection"
  >
    <content-hero-banner
      v-if="collection && collection.title && collection.featuredImage"
      :title="collection.title"
      :image-url="collection.featuredImage"
    />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <product-grid
            v-if="collection.products && collection.products.length > 0"
            :products="visibleProducts"
            :show-add-to-cart="true"
            :show-quantity-update="true"
          />
        </div>
      </div>
      <observe-emitter @observe="showMore" />
      <div
        v-if="isFetching"
        style="text-align: center"
      >
        Loading products...
      </div>
    </section>
  </div>
</template>

<script>
import productModule from '~/store/product/productModule'
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
  async fetch() {
    const collectionData = await this.$nacelle.data.collection({
      handle: this.$route.params.collectionHandle
    })
    this.collection = { products: [], ...collectionData }
    this.collection.products = await this.fetchProducts(0, this.productVisibilityCount + this.fetchBuffer)
  },
  computed: {
    visibleProducts() {
      if (this.collection.products) {
        return this.collection.products.slice(0, this.productVisibilityCount)
      }
      return null
    }
  },
  mounted() {
    // products loaded during SSR fetch need to be stored in indexedDB
    if (this.collection?.products) {
      this.collection.products.map((product) => {
        const namespace = `product/${product.handle}`
        if (!this.$store.hasModule(namespace)) {
          this.$store.registerModule(namespace, productModule(), { preserveState: !!this.$store.state[namespace] })
        }
        this.$store.dispatch(`${namespace}/storeProduct`, product)
      })
    }
  },
  methods: {
    async showMore() {
      if (!this.collection) {
        return
      }
      const currentCount = this.productVisibilityCount
      const fetchCursor = currentCount + this.fetchBuffer
      this.productVisibilityCount = currentCount + 16
      this.collection.products = await this.fetchProducts(fetchCursor, fetchCursor + 16)
    },
    async fetchProducts(start, end) {
      this.isFetching = true

      const products = this.collection.productLists[0].handles
        .slice(start, end)
        .map(handle => {
          const namespace = `product/${handle}`
          if (!this.$store.hasModule(namespace)) {
            this.$store.registerModule(namespace, productModule(), { preserveState: !!this.$store.state[namespace] })
          }
          return this.$store.dispatch(`${namespace}/fetchProduct`, handle)
        })
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
