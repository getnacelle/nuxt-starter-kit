<template>
  <div class="search" :class="`${position}-searchbox`">
    <search-input
      :placeholder-text="placeholderText"
      :position="position"
      :search-query="searchQuery"
      @updated="updateQuery"
      @keydown.enter.native="navigateToSearchResults"
    />
    <button
      v-if="position == 'global'"
      class="button"
      @click="navigateToSearchResults"
    >
      Search
    </button>
    <search-autocomplete v-if="position === 'global'" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    position: {
      type: String,
      default: 'global'
    },
    searchCategory: {
      type: String,
      default: 'product'
    },
    searchQuery: {
      type: String,
      default: null
    },
    placeholderText: {
      type: String,
      default: 'Search products...'
    }
  },
  methods: {
    ...mapMutations('menu', ['disableMenu']),
    ...mapMutations('search', ['setQuery']),
    updateQuery(query) {
      this.setQuery({ query, position: this.position })
    },
    navigateToSearchResults() {
      const queryVal = this.searchQuery || ''

      this.disableMenu()

      if (this.position === 'global') {
        this.$router.push({ path: '/search', query: { q: queryVal } })
      } else {
        this.$router.push({ query: { q: queryVal } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  position: relative;
}
.global-searchbox input,
.global-searchbox button {
  margin-right: 0.5rem;
}
</style>
