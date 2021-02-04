<!--
/****
/* For instructions related to connecting your inventory to
/* Nacelle, please refer to:
/*
/* https://docs.getnacelle.com/getting-started.html#_2-product-settings
/****
-->
<template>
  <div class="product">
    <section class="section">
      <div class="container">
        <product-details
          v-if="product"
          :product="product"
        />
      </div>
    </section>
    <section
      v-if="product"
      class="section product-meta"
    >
      <div class="container">
        <div class="columns">
          <div class="column is-7">
            <h4 class="title is-4">
              What You're Getting
            </h4>
            <div class="content">
              <p>
                Run a manual sweep of anomalous airborne or electromagnetic
                readings. Radiation levels in our atmosphere have increased by
                3,000 percent. Electromagnetic and subspace wave fronts
                approaching synchronization. What is the strength of the ship's
                deflector shields at maximum output? The wormhole's size and
                short period would make this a local phenomenon. Do you have
                sufficient data to compile a holographic simulation?
              </p>
            </div>
          </div>
          <div class="column is-4 is-offset-1 highlight">
            <h4 class="title is-4">
              Our Products
            </h4>
            <div class="content">
              <p>
                It indicates a synchronic distortion in the areas emanating
                triolic waves. The cerebellum, the cerebral cortex, the brain
                stem, the entire nervous system has been depleted of
                electrochemical energy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import productModule from '~/store/product/productModule'
import productMetafields from '~/mixins/productMetafields'
import viewEvent from '~/mixins/viewEvent'
// import jsonld from '~/mixins/jsonld'
import { mapGetters, mapMutations } from 'vuex'

export default {
  mixins: [
    productMetafields,
    viewEvent('product')
    // jsonld('product')
  ],
  data() {
    return {
      product: null
    }
  },
  async fetch() {
    const handle = this.$route.params.productHandle
    const namespace = `product/${handle}`
    if (!this.$store.hasModule(namespace)) {
      this.$store.registerModule(namespace, productModule(), { preserveState: !!this.$store.state[namespace] })
    }
    const product = await this.$store.dispatch(`${namespace}/fetchProduct`, handle)
    this.product = product
  },
  head() {
    if (this.product) {
      const properties = {}
      const meta = []
      const title = this.getMetatag('title')

      if (this.product.title) {
        let fullTitle = this.product.title

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

      if (this.product.description) {
        meta.push({
          hid: 'description',
          name: 'description',
          content: this.product.description
        })
        meta.push({
          hid: 'og:description',
          property: 'og:description',
          content: this.product.description
        })
      }

      if (this.product.featuredMedia) {
        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: this.product.featuredMedia.src
        })
      }

      return {
        ...properties,
        meta
      }
    }
  },
  computed: {
    ...mapGetters('space', ['getMetatag'])
  },

  beforeDestroy() {
    const namespace = `product/${this.product.handle}`
    this.$store.commit(`${namespace}/unloadProduct`)
  },
  methods: {
    ...mapMutations('cart', ['showCart'])
  }
}
</script>

<style lang="scss" scoped>
.price {
  margin-bottom: 1rem;
}

.product-meta .column {
  padding-bottom: 2rem;

  @media screen and (min-width: 769px) {
    padding-top: 3rem;
    padding-bottom: 0;
  }
}

.column.highlight {
  background-color: #f5f5f5;

  @media screen and (min-width: 769px) {
    padding: 3rem;
  }
}
</style>
