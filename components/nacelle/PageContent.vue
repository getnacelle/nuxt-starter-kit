<template>
  <div class="page-content nacelle">
    <div v-if="page"> 
      <div
        v-for="section in page.sections"
        :key="section.id"
      >
        <component
          :is="section.sys.contentType.sys.id"
          v-if="section.sys.contentType"
          :id="section.fields.handle"
          v-bind="section.fields"
        />
      </div>
    </div>
    <nacelle-page-placeholder v-else />
  </div>
</template>

<script>
import HeroBanner from '~/components/nacelle/ContentHeroBanner'
import SideBySide from '~/components/nacelle/ContentSideBySide'
import ProductGrid from '~/components/nacelle/ContentProductGrid'
import CollectionGrid from '~/components/nacelle/CollectionGrid'

export default {
  components: {
    HeroBanner,
    SideBySide,
    ProductGrid,
    CollectionGrid
  },
  props: {
    page: {
      type: Object,
      default: () => ({
        source: '',
        sections: []
      })
    }
  }
}
</script>

<style></style>
