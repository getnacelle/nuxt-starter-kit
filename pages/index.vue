<template>
  <page-content class="page" :page="page" />
</template>

<script>
export default {
  data() {
    return {
      page: null
    }
  },
  async fetch() {
    this.page = await this.$nacelle.data
      .page({
        handle: 'homepage',
        locale: 'en-US'
      })
      .catch(() => {
        console.warn(
          `No page entry with handle 'homepage' found. Please create one in your CMS,`
        )
      })
  }
}
</script>
