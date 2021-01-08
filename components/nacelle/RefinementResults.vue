<template>
  <div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="results && results.length"
        key="no-results"
        class="no-results"
      >
        <slot name="no-results" />
      </div>
      <div
        v-else
        key="results"
        class="search-results"
      >
        <h2>
          Showing {{ results.length }} {{ itemSinglularPlural }} based on
          selected filters
        </h2>
        <slot
          name="result"
          :result="searchResultsSlice"
        />
        <div ref="load-more" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
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
    ...mapState('search', ['results', 'resultsToDisplay', 'filteredData']),
    itemSinglularPlural() {
      if (this.results && this.results.length === 1) {
        return 'item'
      } else {
        return 'items'
      }
    },
    searchResultsSlice() {
      return this.results.slice(0, this.resultsToDisplay)
    }
  },
  watch: {
    filteredData(newData, oldData) {
      if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
        this.resetResults()
      }
    },
    searchQuery(newVal) {
      if (newVal?.value && String(newVal.value) !== '') {
        this.searchCatalog(newVal.value)
      }
    },
    results(newVal) {
      newVal.length
        ? this.$emit('results')
        : this.$emit('no-query')
    }
  },

  mounted() {
    setTimeout(() => {
      if (this.$refs['load-more']) {
        const options = {
          root: null,
          rootMargin: '250px',
          threshold: 1
        }
        const observer = new IntersectionObserver(this.showMoreResults, options)
        const observee = this.$refs['load-more']

        observer.observe(observee)
        this.isObserverInitialized = true
      }
    }, 5000)
  },
  methods: {
    ...mapActions('search', ['searchCatalog']),
    ...mapMutations('search', ['showMoreResults', 'resetResults'])
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
