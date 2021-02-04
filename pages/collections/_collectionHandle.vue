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
            v-if="visibleProducts.length"
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
      collectionProducts: [],
      productVisibilityCount: 12,
      fetchBuffer: 12,
      isFetching: false
    }
  },
  async fetch() {
    const collectionData = await this.$nacelle.data.collection({
      handle: this.$route.params.collectionHandle
    })
    this.collection = collectionData
    await this.fetchProducts(0, this.productVisibilityCount + this.fetchBuffer)
  },
  computed: {
    visibleProducts() {
      if (this.collectionProducts.length) {
        return this.collectionProducts.slice(0, this.productVisibilityCount)
      }
      return []
    }
  },
  mounted() {
    if (process.client && this.collection) {
      this.collectionProducts.forEach(product => {
        const namespace = `product/${product.handle}`
        if (!this.$store.hasModule(namespace)) {
          this.$store.registerModule(namespace, productModule(), { preserveState: !!this.$store.state[namespace] })
        }
        return this.$store.dispatch(`${namespace}/storeProduct`, product)
      })
    }
  },
  beforeDestroy() {
    this.collectionProducts.forEach(product => {
      const namespace = `product/${product.handle}`
      this.$store.commit(`${namespace}/unloadProduct`)
    })
  },
  methods: {
    async showMore() {
      if (!this.collection) {
        return
      }
      const currentCount = this.productVisibilityCount
      const fetchCursor = currentCount + this.fetchBuffer
      this.productVisibilityCount = currentCount + 12
      this.fetchProducts(fetchCursor, fetchCursor + 12)
    },
    async fetchProducts(start, end) {
      if (!this.collection?.productLists[0]?.handles) {
        return
      }
      this.isFetching = true
      // console.time('fetchProducts')

      const products = this.collection.productLists[0].handles
        .slice(start, end)
        .map((handle, index) => {
          this.$set(
            this.collectionProducts,
            index + start,
            { handle, isLoading: true }
          )
          return handle
        })
        .map(async (handle, index) => {
          const namespace = `product/${handle}`
          if (!this.$store.hasModule(namespace)) {
            this.$store.registerModule(namespace, productModule(), { preserveState: !!this.$store.state[namespace] })
          }
          const product = await this.$store.dispatch(`${namespace}/fetchProduct`, handle)
          this.$set(this.collectionProducts, index + start, product)
        })

      await Promise.all(products)
      this.isFetching = false
      // console.timeEnd('fetchProducts')
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
