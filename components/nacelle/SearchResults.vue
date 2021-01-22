<template>
  <div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="isLoading"
        key="loading"
      >
        <slot name="loading" />
      </div>
      <div
        v-else-if="globalResults.length"
        key="results"
        class="search-results"
      >
        <slot
          name="result"
          :result="globalResults"
        />
      </div>
      <div
        v-else
        key="no-results"
        class="no-results"
      >
        <slot name="no-results" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    searchQuery: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapState('search', ['isLoading', 'globalResults'])
  },
  watch: {
    searchQuery(newVal) {
      if (newVal && String(newVal) !== '') {
        this.searchCatalog({value: newVal, position: 'global'})
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
