<template>
  <page-content
    class="page"
    :page="page"
  />
</template>

<script>
export default {
  data() {
    return {
      page: null
    }
  },
  async fetch() {
    this.page = await this.$nacelle.data.page({
      handle: 'homepage',
      locale: 'en-US'
    })
  }
}
</script>
