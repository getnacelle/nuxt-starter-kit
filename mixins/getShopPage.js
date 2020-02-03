import { mapMutations } from 'vuex'
import { getShopPageData, getProductsPerPage } from '../nacelle/fetch-static'
import observeFetchMoreComponent from './observeFetchMoreComponent'

export default ({ itemsPerPage, locale } = {}) => {
  return {
    mixins: [observeFetchMoreComponent],
    data() {
      return {
        allProducts: null,
        products: [],
        productIndex: 0,
        productsPerPage: itemsPerPage || 30,
        isLoadingProducts: false
      }
    },
    async asyncData(context) {
      // Check if shop data saved in vuex store
      const { store, app } = context
      const { $nacelle } = app
      const getCollection = store.getters['collections/getCollection']
      const storeCollection = getCollection('shop')

      if (storeCollection) {
        return {
          ...storeCollection
        }
      }

      // If not in store fetch static data
      const shopPageData = await getShopPageData(context)
      let products = []

      if (shopPageData && shopPageData.allProducts) {
        products = await getProductsPerPage({
          handles: shopPageData.allProducts,
          productsPerPage: itemsPerPage || 30,
          locale: locale || $nacelle.locale
        })
      }

      // Create shop page object for vuex store and returned async data
      const shopPageObj = {
        handle: 'shop',
        ...shopPageData,
        products,
        productIndex: products.length
      }

      store.commit('collections/addCollection', shopPageObj)

      return shopPageObj
    },
    async created () {
      let updateShopPage = false
      if (process.browser) {
        // If no shop all products, fetch
        if (!Array.isArray(this.allProducts) || !this.allProducts.length) {
          this.allProducts = await this.$nacelle.shopAllProducts()
          updateShopPage = true
        }

        if (this.products.length === 0) {
          if (this.allProducts) {
            this.isLoadingProducts = true
            this.products = await getProductsPerPage({
              handles: this.allProducts,
              productsPerPage: this.productsPerPage,
              locale: locale || this.$nacelle.locale
            })
            updateShopPage = true
          }
        }
      }

      this.productIndex += this.productsPerPage
      this.isLoadingProducts = false

      if (updateShopPage) {
        this.updateCollection({
          handle: 'shop',
          allProducts: this.allProducts,
          products: this.products,
          productIndex: this.products.length
        })
      }
    },
    methods: {
      ...mapMutations('collections', ['updateCollection']),
      async fetchMore() {
        if (
          !this.isLoadingProducts &&
          Array.isArray(this.allProducts) &&
          this.productIndex < this.allProducts.length
        ) {
          this.isLoadingProducts = true

          const nextPageProducts = await getProductsPerPage({
            handles: this.allProducts,
            productsPerPage: this.productsPerPage,
            index: this.productIndex,
            locale: locale || this.$nacelle.locale
          })

          this.products = [
            ...this.products,
            ...nextPageProducts
          ]
          this.productIndex += this.productsPerPage
          this.isLoadingProducts = false
          this.updateCollection({
            handle: 'shop',
            allProducts: this.allProducts,
            products: this.products,
            productIndex: this.productIndex
          })
        }
      }
    }
  }
}
