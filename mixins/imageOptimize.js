export default {
  props: {
    cropDirection: {
      type: String,
      default: 'center'
    }
  },
  data() {
    return {
      originCDN: null,
      validImage: true,
      optimizing: false
    }
  },
  methods: {
    optimizeSource({
      url = null,
      format = 'auto',
      width = null,
      height = null,
      crop = false,
      focus = null
    } = {}) {
      this.optimizing = true
      if (typeof url !== 'string') {
        throw new Error(
          `Image src must be a string; Received type: ${typeof url}\nReceived: ${JSON.stringify(
            url
          )}`
        )
      }
      const src = this.sanitizeUrl({ url })
      this.setImageOrigin({ url: src })

      let optimizedSrc
      if (!width && !height) {
        optimizedSrc = this.reformatImage({
          src,
          format
        })
      } else {
        optimizedSrc = this.resizeImage({
          src: this.reformatImage({ src, format }),
          width: this.roundedUpToNearest50px(width),
          height: this.roundedUpToNearest50px(height),
          crop,
          focus
        })
      }
      this.optimizing = false

      return optimizedSrc
    },

    fallback() {
      this.validImage = false
    },

    roundedUpToNearest50px(x) {
      if (x >= 50) {
        return +x + 49 - ((+x + 49) % 50)
      }
    },

    resizeImage({
      src = null,
      width = null,
      height = null,
      crop = false
    } = {}) {
      if (this.originCDN === 'contentful') {
        return this.contentfulResize({ src, width, height, crop })
      } else if (this.originCDN === 'shopify') {
        return this.shopifyResize({ src, width, height, crop })
      } else if (this.originCDN === 'unknown') {
        return src
      }
    },

    reformatImage({ src = null, format = 'auto' } = {}) {
      try {
        if (this.originCDN === 'shopify') {
          return format === 'auto'
            ? this.shopifyReformat({ src })
            : this.shopifyReformat({ src, format })
        } else if (this.originCDN === 'contentful') {
          return format === 'auto'
            ? this.contentfulReformat({ src })
            : this.contentfulReformat({ src, format })
        } else if (this.originCDN === 'unknown') {
          return src
        }
      } catch (err) {
        console.error(
          'Invalid image transformation.\n' +
            `Cannot transform ${src} to format: "${format}"`
        )
      }
    },

    /**
     * Returns a query string for an image in the requested dimensions.
     *
     * NOTE: Rounds up size to the nearest 50px increment.
     *
     * @param {Object} options - Configuration options
     * @param {string} options.src - The image `src`
     * @param {string} options.width - The desired output width, in pixels
     * @param {string} options.height - The desired output height, in pixels
     * @param {boolean} options.crop - Whether or not to crop the image
     */
    shopifyResize({
      src = null,
      width = null,
      height = null,
      crop = false
    } = {}) {
      const getSizeString = () => {
        if (width && height) {
          return `_${width}x${height}`
        } else if (width && !height) {
          return crop
            ? `_${width}x${this.roundedUpToNearest50px((width / 3) * 4)}`
            : `_${width}x`
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
          ? args.split('&').filter((el) => el.includes('width=') === false)
          : []
        const newSrc = newBase.concat(`.${extension}?${newArgs.join('&')}`)
        return newSrc
      }
      return null
    },

    /**
     * Takes either a png or jpg (other formats will not work),
     * Returns query string for image in WebP or PJPG format.
     *
     * NOTE: Transformation only works on png and jpg images.
     *
     * @param {Object} options - Configuration options
     * @param {string} options.src - The image `src`
     * @param {string} options.format - The desired output format
     *
     * @example
     * // returns: "https://cdn.shopify.com/s/files/myPicture.png&format=pjpg"
     * shopifyReformat({ src: "https://cdn.shopify.com/s/files/myPicture.png", format: 'pjpg'})
     *
     * @example
     * // returns: "https://cdn.shopify.com/s/files/myPicture.jpg&format=webp"
     * shopifyReformat({ src: "https://cdn.shopify.com/s/files/myPicture.jpg", format: 'webp'})
     */
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

    contentfulSplitUrl({ src = null }) {
      const [baseWithExt, args] = src.split('?')
      const [extension] = Array.from(baseWithExt.split('.')).reverse()
      const [base] = baseWithExt.split(`.${extension}`)
      return [base, args, extension]
    },

    contentfulResize({
      src = null,
      width = null,
      height = null,
      crop = false
    } = {}) {
      function getSizeString() {
        if (width && height) {
          return `w=${width}&h=${height}`
        } else if (width && !height) {
          return `w=${width}`
        } else if (!width && height) {
          return `h=${height}`
        } else {
          return new Error('No image size specified')
        }
      }
      if (typeof src === 'string') {
        const [base, args, extension] = this.contentfulSplitUrl({ src })
        const sizeString = getSizeString()
        const cropString = crop ? `&fit=crop&f=${crop}` : ''
        const newArgs = args
          ? args
            .split('&')
            .filter((el) => el.includes('width=') === false)
            .join('&')
            .concat(`&${sizeString}`)
          : sizeString + cropString
        const newSrc = newArgs
          ? base.concat(`.${extension}?${newArgs}`)
          : base.concat(`.${extension}`)
        return newSrc
      }
      return null
    },

    /**
     * Takes an image stored in Contentful and returns a query string
     * or image in the requested format.
     *
     * @param {Object} options - Configuration options
     * @param {string} options.src - The image `src`
     * @param {string} options.format - The desired output format ('webp' , 'pjpg' , etc.)
     */
    contentfulReformat({ src = null, format = 'webp' } = {}) {
      if (typeof src === 'string') {
        const [base, args, extension] = this.contentfulSplitUrl({ src })
        const imgFormat = format === 'jpeg' ? 'jpg' : format
        if (imgFormat !== extension) {
          const newArgs = args
            ? args
              .split('&')
              .filter((el) => el.includes('fl=') === false)
              .filter((el) => el.includes('fm=') === false)
              .join('&')
            : ''
          if (
            imgFormat === 'png' ||
            imgFormat === 'jpg' ||
            imgFormat === 'webp'
          ) {
            return `${base}.${extension}?${newArgs}&fm=${imgFormat}`
          } else if (imgFormat === 'pjpg') {
            return `${base}.${extension}?${newArgs}&fm=jpg&fl=progressive`
          }
        } else {
          // return the original image if not being converted to a possible extension
          return src
        }
      } else {
        return null
      }
    },

    fromShopifyCDN({ url = null } = {}) {
      if (!url) {
        throw new Error("Function 'fromShopifyCDN' not provided a url")
      }
      if (typeof url === 'string') {
        return url.includes('cdn.shopify')
      }
      return false
    },

    fromContentfulCDN({ url = null } = {}) {
      if (!url) {
        throw new Error("Function 'fromContentfulCDN' not provided a url")
      }
      if (typeof url === 'string') {
        return url.includes('ctfassets.net')
      }
      return false
    },

    removeUrlParams({ url = null } = {}) {
      return url.split('&')[0]
    },

    sanitizeUrl({ url = null } = {}) {
      const src = this.removeUrlParams({ url })
      if (src.split('//')[0] !== 'https:') {
        return `https://${src.split('//')[1]}`
      } else {
        return src
      }
    },

    setImageOrigin({ url = null } = {}) {
      if (this.fromShopifyCDN({ url })) {
        this.originCDN = 'shopify'
      } else if (this.fromContentfulCDN({ url })) {
        this.originCDN = 'contentful'
      } else {
        this.originCDN = 'unknown'
      }
    }
  }
}
