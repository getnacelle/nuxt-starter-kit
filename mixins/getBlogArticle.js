export default (config = {}) => {
  return {
    data() {
      return {
        articleHandle: null,
        blogHandle: null,
        article: null,
        noArticleData: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { articleHandle, blogHandle } = params

      const articleObj = {
        articleHandle: config.articleHandle || articleHandle,
        blogHandle: config.blogHandle || blogHandle,
        article: null,
        locale: config.locale || $nacelle.locale
      }

      return {
        ...articleObj
      }
    },
    created() {
      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.article = await this.$nacelle.data.article({
            handle: this.articleHandle,
            blogHandle: this.blogHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
            this.noArticleData = true
          })
        }
      })
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
}
