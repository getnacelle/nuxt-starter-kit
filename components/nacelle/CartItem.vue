<template>
  <div class="columns is-marginless is-mobile flyout-cart-item">
    <router-link
      :to="`${pathFragment}${item.handle}`"
      class="column is-3"
      @click.native="hideCart"
    >
      <nacelle-image
        v-if="productThumbnail && productThumbnail.length > 0"
        :src="productThumbnail"
        :alt="item.title"
        :width="100"
        :height="100"
      />
    </router-link>

    <div class="column is-9">
      <router-link
        :to="`${pathFragment}${item.handle}`"
        @click.native="hideCart"
      >
        <product-title
          :title="item.title"
          class="flyout-item-title"
          element="h4"
        />
      </router-link>
      <p
        v-if="title != 'Default Title'"
        class="flyout-item-variant-title variant-title nacelle"
      ></p>
      <div class="flyout-item-details columns is-marginless is-paddingless">
        <product-price class="flyout-item-price" :price="item.variant.price" />
        <quantity-selector :item="item" :quantity="item.quantity" />
        <cart-flyout-item-remove-button :line-id="item.variant.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    pathFragment: {
      type: String,
      default: '/products/'
    }
  },
  computed: {
    productThumbnail() {
      return this.item?.image?.thumbnailSrc
    },
    variant() {
      const defaultVariant = {
        id: '',
        title: '',
        price: 0
      }

      if (this.item && this.item.variant) {
        return {
          ...defaultVariant,
          ...this.item.variant
        }
      }

      return defaultVariant
    }
  },
  methods: {
    ...mapMutations('cart', ['hideCart'])
  }
}
</script>

<style lang="scss" scoped>
.flyout-cart-item {
  padding: 1rem;
}
.flyout-item-title {
  font-size: 16pt;
  margin-bottom: 0.7rem;
}
.flyout-item-variant-title {
  margin-bottom: 0.5rem;
}
.flyout-item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flyout-item-price {
  margin-bottom: 0;
}
</style>
