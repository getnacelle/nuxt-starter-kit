<template>
  <div class="page">
    <page-content
      v-if="!$fetchState.pending"
      :page="page"
    />
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
      locale: 'en-US'
    })
  }

}
</script>
