<!-- 
/****
/* Product collections are loaded with the getCollection mixin.
/* For information about creating collections, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/collections.html#adding-content-to-collections-pages
/****
-->
<template>
  <div class="page page-shop" v-if="collection">
    <content-hero-banner
      v-if="collection"
      :title="collection.title"
      :backgroundImgUrl="featuredImage"
    />
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <product-grid
            v-if="products && products.length > 0"
            :products="products"
            :showAddToCart="true"
            :showQuantityUpdate="true"
          />
        </div>
      </div>
      <observe-emitter v-on:observe="fetchMore" />
    </section>
  </div>
</template>

<script>
import getCollection from '~/mixins/getCollection'
import ContentHeroBanner from '~/components/ContentHeroBanner'
import ProductGrid from '~/components/ProductGrid'
import ObserveEmitter from '~/components/ObserveEmitter'
import { mapGetters } from 'vuex'
export default {
  name: 'collection',
  components: {
    ContentHeroBanner,
    ProductGrid,
    ObserveEmitter
  },
  mixins: [getCollection()],
  computed: {
    ...mapGetters('space', ['getMetatag']),
    featuredImage() {
      if (
        this.collection &&
        this.collection.featuredMedia &&
        this.collection.featuredMedia.src
      ) {
        return this.collection.featuredMedia.src
      }

      return null
    }
  },
  head() {
    if (this.collection) {
      const properties = {}
      const meta = []
      const title = this.getMetatag('title')

      if (this.collection.title) {
        let fullTitle = this.collection.title

        if (title) {
          fullTitle = `${fullTitle} | ${title.value}`
        }

        properties.title = fullTitle
        meta.push({
          hid: 'og:title',
          property: 'og:title',
          content: fullTitle
        })
      }

      if (this.collection.description) {
        meta.push({
          hid: 'description',
          name: 'description',
          content: this.collection.description
        })
        meta.push({
          hid: 'og:description',
          property: 'og:description',
          content: this.collection.description
        })
      }

      if (this.featuredImage) {
        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: this.featuredImage
        })
      }

      return {
        ...properties,
        meta
      }
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
