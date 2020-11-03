<template>
  <div class="page">
    <page-content :page="page" />
  </div>
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
      handle: this.$route.params.pageHandle,
      locale: 'en-us'
    })
  }

}
</script>
