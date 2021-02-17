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
    const { name: handle } = this.$route
    this.page = await this.$nacelle.data
      .page({ handle, locale: 'en-US' })
      .catch(() => console.warn(`No page with handle: '${handle}' found`))
  }
}
</script>
