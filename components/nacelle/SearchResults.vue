<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" key="loading">
        <slot name="loading" />
      </div>
      <div v-else-if="results.length" key="results" class="search-results">
        <slot name="result" :result="results"/>
      </div>
      <div v-else key="no-results" class="no-results">
        <slot name="no-results"/>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    searchData: {
      type: Array
    },
    searchQuery: {
      type: Object
    }
  },
  computed: {
    ...mapState('search', ['isLoading', 'results']),
    searchResults() {
      if (
        this.searchQuery?.value &&
        String(this.searchQuery.value) !== ''
      ) {
        this.searchCatalog(this.searchQuery.value)
      }

      return this.searchData
    }
  },
  watch: {
    searchQuery(newVal) {
      if (newVal?.value && String(newVal.value) !== '') {
        this.searchCatalog(this.searchQuery.value)
      }
    },
    results(newVal) {
      newVal?.length
        ? this.$emit('results')
        : this.$emit('no-query')
    }
  },
  methods: {
    ...mapActions('search', ['searchCatalog'])
  }
}
</script>

<style lang="scss" scoped>
.search-results,
.no-results {
  min-height: 400px;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
