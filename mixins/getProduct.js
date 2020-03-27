export default ({ productHandle, locale } = {}) => {
  return {
    data () {
      return {
        handle: null,
        product: null,
        noProductData: false
      }
    },
    async asyncData (context) {
      const { params, payload, app } = context
      const { handle } = params
      const { $nacelle } = app

      if (payload && payload.productData) {
        return {
          product: payload.productData
        }
      }

      if (typeof process.server === 'undefined' || process.server) {
        return {}
      }

      const productData = await $nacelle.data.product({
        handle: productHandle || handle,
        locale: locale
      })

      return {
        product: productData
      }
    },
    async created () {
      this.handle = productHandle || this.$route.params.handle

      if (process.browser) {
        if (!this.product && !this.noProductData) {
          const productData = await this.$nacelle.data.product({
            handle: this.handle,
            locale: locale
          })

          if (productData) {
            if (productData.noData) {
              this.noproductData = true
            } else {
              this.product = productData
            }
          } else {
            this.noproductData = true
          }
        }
      }
    }
  }
}
