<template>
  <div class="page">
    <page-content v-if="!$fetchState.pending" :page="page" />
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
    const { pageHandle: handle } = this.$route.params
    this.page = await this.$nacelle.data
      .page({ handle, locale: 'en-US' })
      .catch(() => console.warn(`No page with handle: '${handle}' found`))
  }
}
</script>
