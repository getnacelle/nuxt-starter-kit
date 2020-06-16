import { mapMutations } from 'vuex'

export default (config = {}) => {
  return {
    data() {
      return {
        collectionHandle: null,
        collection: null,
        noCollectionData: false,
        products: [],
        productIndex: 0,
        productsPerPage: config.itemsPerPage || 30,
        selectedList: config.selectedList || 'default',
        isLoadingProducts: false
      }
    },
    async asyncData(context) {
      const { params, app, store } = context
      const { collectionHandle, pageHandle, productHandle } = params
      const { $nacelle } = app

      let handle = null

      // Find the correct handle to query
      if (config && config.collectionHandle) {
        handle = config.collectionHandle
      } else if (collectionHandle) {
        handle = collectionHandle
      } else if (pageHandle) {
        handle = pageHandle
      } else if (productHandle) {
        handle = productHandle
      }

      // Set up collection page object defaults
      const collectionObj = {
        collectionHandle: handle,
        collection: null,
        products: [],
        productIndex: 0,
        selectedList: config.selectedList || 'default',
        locale: config.locale || $nacelle.locale
      }

      // If Nuxt Server, use fs to read static json files rather than using
      // Nacelle SDK method
      if (process.server) {
        const fs = require('fs')
        try {
          const file = fs.readFileSync(
            `./static/data/collections/${collectionObj.collectionHandle}::${collectionObj.locale}/static.json`,
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
          const productList = collectionObj.collection.productLists.find(list => {
            return list.slug === collectionObj.selectedList
          })

          const handles = productList.handles.slice(0, collectionObj.itemsPerPage)

          handles.forEach(handle => {
            const productFile = fs.readFileSync(`./static/data/products/${handle}::${collectionObj.locale}/static.json`, 'utf-8')
            collectionObj.products.push(JSON.parse(productFile))
          })
        }
      } else {
        // Check if collection saved in Vuex store
        // Loading from store will allow for restoring scroll position
        const getCollection = store.getters['collections/getCollection']
        const storeCollection = getCollection(collectionObj.collectionHandle)

        if (storeCollection && storeCollection.locale === $nacelle.locale) {
          return {
            ...storeCollection
          }
        }

        // Use Nacelle SDK methods for loading collection and product data
        collectionObj.collection = await $nacelle.data.collection({
          handle: collectionObj.collectionHandle,
          locale: collectionObj.locale
        }).catch(() => {
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
      }

      // Update the product index
      collectionObj.productIndex = collectionObj.products.length

      // Store the collection data in Vuex
      store.commit('collections/addCollection', collectionObj)

      // Return updated collection object
      return {
        ...collectionObj
      }
    },
    created() {
      // Fetch locale specific collection data if user's locale prefer
      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLanguage') {
          this.locale = mutation.payload
          this.isLoadingProducts = true

          this.collection = await this.$nacelle.data.collection({
            handle: this.collectionHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
            this.nocollectionData = true
          })

          if (
            this.collection &&
            this.collection.productLists &&
            this.collection.productLists.length > 0
          ) {
            this.products = await this.$nacelle.data.collectionPage({
              collection: this.collection,
              selectedList: this.selectedList || 'default',
              paginate: true,
              itemsPerPage: this.itemsPerPage || 12,
              locale: this.$nacelle.locale
            })

            this.productIndex = this.products.length

            this.updateCollectionProducts({
              handle: this.collectionHandle,
              products: this.products,
              productIndex: this.productIndex
            })
          }

          this.isLoadingProducts = false
        }
      })
    },
    beforeDestroy() {
      this.unsubscribe()
    },
    computed: {
      // Collections can have many product lists. This returns the currently
      // selected product list
      selectedProductList() {
        if (
          this.collection &&
          Array.isArray(this.collection.productLists)
        ) {
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
    methods: {
      ...mapMutations('collections', ['updateCollectionProducts']),
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

          this.products = [
            ...this.products,
            ...nextPageProducts
          ]
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
}
