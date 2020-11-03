<template>
  <div class="page">
    <page-content :page="page" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: null,
      catalog: null
    }
  },
  async fetch() {
    this.page = await this.$nacelle.data.page({
      handle: 'homepage'
    })
    this.catalog = await this.$nacelle.shopAllProducts()
  }
}
</script>
