<template>
  <div class="page-content nacelle">
    <div v-if="page">
      <div
        v-for="section in page.sections"
        :key="section.id"
      >
        <component
          :is="getComponentDefinition(section.sys.contentType.sys.id)"
          v-if="section.sys.contentType"
          :id="section.fields.handle"
          v-bind="section.fields"
          :type="section.sys.contentType.sys.id"
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
import NacelleComponentPlaceholder from '~/components/nacelle/NacelleComponentPlaceholder'
import { pascalCase } from 'pascal-case'

export default {
  components: {
    HeroBanner,
    SideBySide,
    ProductGrid,
    CollectionGrid,
    NacelleComponentPlaceholder,
  },
  props: {
    page: {
      type: Object,
      default: () => ({
        source: '',
        sections: [],
      }),
    },
  },
  methods: {
    getComponentDefinition(def) {
      if (this.$options.components[pascalCase(def)]) {
        return def
      } else {
        return 'NacelleComponentPlaceholder'
      }
    },
  },
}
</script>

<style></style>
