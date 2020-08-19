<template>
  <div class="nacelle collection-data-load">
    <slot v-if="collection" :collection="collection" :products="products" />
    <button v-if="showButton" @click="fetchMore" class="nacelle button">
      {{ buttonText }}
    </button>
    <observe-emitter v-else v-on:observe="fetchMore" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import ObserveEmitter from '~/components/nacelle/ObserveEmitter'

export default {
  components: {
    ObserveEmitter
  },
  props: {
    handle: {
      type: String,
      default: ''
    },
    locale: {
      type: String,
      default: ''
    },
    paginate: {
      type: Boolean,
      default: false
    },
    productsPerPage: {
      type: Number,
      default: 30
    },
    selectedList: {
      type: String,
      default: 'default'
    },
    useButtonLoadMore: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'Load More'
    }
  },
  data() {
    return {
      collectionHandle: null,
      collection: null,
      noCollectionData: false,
      products: [],
      productIndex: 0,
      isLoadingProducts: false,
    }
  },
  computed: {
    ...mapGetters('collections', ['getCollection']),
    showButton() {
      if (
        this.useButtonLoadMore &&
        this.collection &&
        this.productIndex < this.selectedProductList.length
      ) {
        return true
      }

      return false
    },
    useLocale() {
      if (this.locale && this.locale !== '') {
        return this.locale
      }

      if (this.$nacelle && this.$nacelle.locale) {
        return this.$nacelle.locale
      }

      return 'en-us'
    },
    selectedProductList() {
      if (this.collection && Array.isArray(this.collection.productLists)) {
        const list = this.collection.productLists.find(collection => {
          return collection.slug === this.selectedList
        })

        if (list && Array.isArray(list.handles)) {
          return list.handles
        }
      }

      return []
    }
  },
  async fetch() {
    const { $nacelle } = this
    const handle = this._props && this._props.handle
    const selectedList = this._props && this._props.selectedList
    const locale = this._props && this._props.locale

    const collectionObj = {
      collectionHandle: handle,
      collection: null,
      products: [],
      productIndex: 0,
      selectedList: selectedList || 'default',
      locale: locale || $nacelle.locale
    }

    // Check if collection saved in vuex store
    // Loading from store will allow for restoring scroll position
    const storeCollection = this.getCollection(collectionObj.collectionHandle)

    if (storeCollection) {
      return {
        ...storeCollection
      }
    }

    // If Nuxt Server, use fs to read static json files rather than using
    // Nacelle SDK method
    if (process.server) {
      const fs = require('fs')
      try {
        const file = fs.readFileSync(
          `./static/data/collections/${collectionObj.collectionHandle}--${collectionObj.locale}/static.json`,
          'utf-8'
        )
        collectionObj.collection = JSON.parse(file)
      } catch (err) {
        collectionObj.noCollectionData = true
      }

      if (
        collectionObj.collection &&
        collectionObj.collection.productLists &&
        collectionObj.collection.productLists.length > 0
      ) {
        const productList = collectionObj.collection.productLists.find(
          list => {
            return list.slug === collectionObj.selectedList
          }
        )

        const handles = productList.handles.slice(
          0,
          collectionObj.itemsPerPage
        )

        handles.forEach(handle => {
          const productFile = fs.readFileSync(
            `./static/data/products/${handle}--${collectionObj.locale}/static.json`,
            'utf-8'
          )
          collectionObj.products.push(JSON.parse(productFile))
        })
      }
    } else {
      if (process.browser || process.client) {
        const storeCollection = this.getCollection(this.handle)

        if (storeCollection) {
          this.collection = storeCollection.collection
          this.products = storeCollection.products
        } else {
          // Use Nacelle SDK methods for loading collection and product data
          collectionObj.collection = await $nacelle.data
            .collection({
              handle: collectionObj.collectionHandle,
              locale: collectionObj.locale
            })
            .catch(() => {
              collectionObj.noCollectionData = true
            })

          if (
            collectionObj.collection &&
            collectionObj.collection.productLists &&
            collectionObj.collection.productLists.length > 0
          ) {
            collectionObj.products = await $nacelle.data.collectionPage({
              collection: collectionObj.collection,
              list: collectionObj.selectedList,
              paginate: true,
              itemsPerPage: collectionObj.itemsPerPage,
              locale: collectionObj.locale
            })
          }
          this.$nacelle.data
            .collection({
              handle: this.handle,
              locale: this.useLocale
            })
            .then(result => {
              if (result) {
                this.collection = result
                this.products = []
                this.addCollection({
                  handle: this.handle,
                  collection: this.collection,
                  products: this.products,
                  productIndex: 0
                })
                this.fetchProducts()
              }
            })
        }
      }
    }

    // Update the product index
    collectionObj.productIndex = collectionObj.products.length

    // Store the collection data in Vuex
    this.addCollection(collectionObj)

    // Return updated collection object
    this.collectionHandle = collectionObj.collectionHandle
    this.collection = collectionObj.collection
    this.products = collectionObj.products
    this.collection = collectionObj.collection
    this.productIndex = collectionObj.productIndex
  },
  methods: {
    ...mapActions('collections', ['addCollection', 'updateCollectionProducts']),
    // Load a new "page" of products
    async fetchMore() {
      if (
        !this.isLoadingProducts &&
        this.collection &&
        this.productIndex < this.selectedProductList.length
      ) {
        this.isLoadingProducts = true

        const nextPageProducts = await this.$nacelle.data.collectionPage({
          collection: this.collection,
          list: this.selectedList,
          paginate: true,
          index: this.productIndex,
          itemsPerPage: this.productsPerPage,
          locale: this.locale
        })

        this.products = [...this.products, ...nextPageProducts]
        this.productIndex += this.productsPerPage
        this.isLoadingProducts = false

        this.updateCollectionProducts({
          handle: this.collectionHandle,
          products: this.products,
          productIndex: this.productIndex
        })
      }
    }
  }
}
</script>

<style></style>
