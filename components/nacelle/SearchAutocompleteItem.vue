<template>
  <router-link :to="`${pathFragment}${item.handle}`">
    <div class="columns is-marginless is-mobile nacelle is-vcentered">
      <nacelle-image
        :src="item.featuredMedia.thumbnailSrc"
        :width="150"
        :height="150"
        class="autocomplete-thumb"
      />
      <h3 class="column is-5">
        {{ item.title }}
      </h3>
      <product-price class="column is-3 is-marginless" :price="productPrice" />
    </div>
  </router-link>
</template>

<script>
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
      return this.item?.featuredMedia?.thumbnailSrc
    },
    productPrice() {
      return this.item?.variants?.[0]?.price
    }
  }
}
</script>
<style lang="scss" scoped>
.autocomplete-thumb {
  min-width: 150px;
  min-height: 150px;
}
</style>
