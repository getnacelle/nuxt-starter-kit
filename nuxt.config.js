import generateRoutes from './nacelle-routing/generateRoutes'
require('dotenv').config()

export default {
  mode: process.env.BUILD_MODE,
  target: 'static',
  components: true,
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['@/assets/global.scss', 'vue-glide-js/dist/vue-glide.css'],

  env: {
    nacelleSpaceID: process.env.NACELLE_SPACE_ID,
    nacelleToken: process.env.NACELLE_GRAPHQL_TOKEN,
    buildMode: process.env.BUILD_MODE,
    contentAssetStorage: process.env.CONTENT_ASSET_STORAGE || '',
    API_PORT: process.env.API_PORT
  },

  plugins: [
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
    '~/plugins/jsonld'
  ],

  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/sitemap',
    '@nuxtjs/axios',
    'nuxt-polyfill',
    '~/modules/nacelle'
  ],

  router: {
    middleware: 'cart'
  },

  polyfill: {
    features: [
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      }
    ]
  },

  sitemap: {
    gzip: true,
    hostname: 'http://localhost:3000' // When deploying, change this to your production URL
  },

  generate: {
    crawler: false,
    concurrency: 25,
    async routes() {
      return generateRoutes()
    }
  },

  /*
   ** Nacelle Configuration
   * https://docs.getnacelle.com/nuxt/nuxt-config.html
   */
  nacelle: {
    spaceID: process.env.NACELLE_SPACE_ID,
    token: process.env.NACELLE_GRAPHQL_TOKEN,
    isMultiLocale: true
  },

  vue: {
    config: {
      devtools: true
    }
  },

  build: {
    extend(config, ctx) {
      config.node = {
        Buffer: false
      }
    },
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    }
  }
}
