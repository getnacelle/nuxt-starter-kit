import { mapGetters } from 'vuex'

export default {
  props: {
    containerRef: {
      type: String,
      default: ''
    },
    reformat: {
      type: Boolean,
      default: true
    },
    resizeToScreenWidth: {
      type: Boolean,
      default: false
    },
    cropDirection: {
      type: String,
      default: 'center'
    },
    blurUp: {
      type: Boolean,
      default: false
    },
    byDominantColor: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  data() {
    return {
      blankImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 5'%3E%3C/svg%3E",
      blurred: null,
      containerWidth: null,
      containerHeight: null,
      containerPosition: null,
      loaded: false,
      originCDN: null,
      validImage: true
    }
  },
  computed: {
    ...mapGetters('space', ['getMetafield']),
    cdn() {
      const supportedCDNs = ['shopify']
      const metafieldCDN = this.getMetafield('cdn', 'provider')
        ? this.getMetafield('cdn', 'provider').toLowerCase()
        : ''
      return supportedCDNs.includes(metafieldCDN) ? metafieldCDN : 'shopify'
    },
    fallbackImage() {
      return this.blankImage
    },
    loading() {
      return !this.loaded
    },
    placeholderImg(w, h) {
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`
    },
    shopifyPathPrefix() {
      const path = this.getMetafield('cdn', 'shopify-path-prefix') || 'https://cdn.shopify.com/s/files/'
      return path.split('').reverse()[0] !== '/' ? path.concat('/') : path
    }
  },
  methods: {
    optimizeSource({ url = null, format = 'auto', width = null, height = null, crop = false } = {}) {
      let newSource
      if (typeof url === 'string') {
        if (this.fromShopifyCDN({ url })) {
          this.originCDN = 'shopify'
          const source = url
          if (this.reformat && (!width && !height)) {
            newSource = this.reformatImage({
              src: source, format
            })
          } else if (this.reformat && (width || height)) {
            newSource = this.resizeImage({
              src: this.reformatImage({ src: source, format }),
              width: this.roundedUpToNearest50px(width),
              height: this.roundedUpToNearest50px(height),
              crop
            })
          } else if (!this.reformat && (width || height)) {
            newSource = this.resizeImage({
              src: source,
              width: this.roundedUpToNearest50px(width),
              height: this.roundedUpToNearest50px(height),
              crop
            })
          } else {
            newSource = source
          }
        } else newSource = url
        return newSource
      }
      return url
    },
    calculateContainer() {
      if ((process.client || process.browser) && this.containerRef) {
        this.containerHeight = this.$refs[this.containerRef].clientHeight
        this.containerWidth = this.$refs[this.containerRef].clientWidth
        this.containerPosition = window.getComputedStyle(
          this.$refs[this.containerRef]
        ).position
      }
    },
    onLoaded() {
      this.loaded = true
    },
    fallback() {
      this.validImage = false
    },
    getBlurred({ src = null } = {}) {
      return this.shopifyResize({
        src,
        width: 20,
        height: ''
      })
    },
    getDominantColor({ src = null } = {}) {
      return this.shopifyResize({
        src,
        width: 1,
        height: ''
      })
    },
    roundedUpToNearest50px(x) {
      if (x >= 50) {
        return +x + 49 - ((+x + 49) % 50)
      }
      // Return a blank string if less than 50px
      return ''
    },
    resizeImage({ src = null, width = null, height = null, crop = false } = {}) {
      if (this.cdn.toLowerCase() === 'shopify') {
        return this.shopifyResize({ src, width, height, crop })
      }
    },
    reformatImage({ src = null, format = 'auto' } = {}) {
      if (this.cdn.toLowerCase() === 'shopify') {
        return format === 'auto'
          ? this.shopifyReformat({ src })
          : this.shopifyReformat({ src, format })
      }
      return null
    },
    shopifyResize({ src = null, width = null, height = null, crop = false } = {}) {
      const getSizeString = () => {
        if (width && height) {
          return `_${width}x${height}`
        } else if (width && !height) {
          return crop ? `_${width}x${this.roundedUpToNearest50px((width / 3) * 4)}` : `_${width}x`
        } else if (!width && height) {
          return `_x${height}`
        } else {
          return ''
        }
      }
      if (typeof src === 'string') {
        const [baseWithExt, args] = src.split('?')
        const [extension] = Array.from(baseWithExt.split('.')).reverse()
        const [base] = baseWithExt.split(`.${extension}`)
        const newSizeString = getSizeString()
        const cropString = crop ? `_crop_${this.cropDirection}` : ''
        const newBase = base.concat(newSizeString, cropString)
        const newArgs = args
          ? args.split('&').filter(el => el.includes('width=') === false)
          : null
        const newSrc = newBase.concat(`.${extension}?${newArgs.join('&')}`)
        return newSrc
      }
      return null
    },
    shopifyReformat({ src = null, format = 'webp' } = {}) {
      if (typeof src === 'string') {
        const extension = Array.from(src.split('?v=')[0].split('.')).pop()
        if (extension === 'png' || extension === 'jpg') {
          return src
            .split('&format=')[0]
            .concat(`&format=${format === 'auto' ? 'jpg' : format}`)
        } else {
          // return the original image if it is a gif / not a png or jpg
          return src
        }
      } else {
        return null
      }
    },
    fromShopifyCDN({ url = null } = {}) {
      if (typeof url === 'string') {
        return url.split('.com')[0] === 'https://cdn.shopify'
      }
      return false
    },
    fromMagentoCDN({ url = null } = {}) {
      // Note that not all Magento stores use images from the Magento CDN
      if (typeof url === 'string') {
        const [, str1, str2, str3] = url.split('://')[1].split('/')
        return str1.concat('/', str2, '/', str3) === 'media/catalog/product'
      }
      return false
    }
  }
}
