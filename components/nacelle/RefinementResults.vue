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
        v-else-if="searchData.length"
        key="results"
        class="search-results"
      >
        <h2>
          Showing {{ searchData.length }} {{ itemSinglularPlural }} based on
          selected filters
        </h2>
        <slot
          name="result"
          :result="visibleResults"
        />
        <observe-emitter @observe="showMoreResults" />
        <div
          v-if="isFetching"
          style="text-align: center"
        >
          Loading products...
        </div>
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
import { mapState, mapMutations } from 'vuex'
import productModule from '~/store/product/productModule'

export default {
  props: {
    searchData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fetchBuffer: 12,
      isFetching: 0
    }
  },
  computed: {
    ...mapState('search', ['isLoading', 'resultsToDisplay']),

    itemSinglularPlural() {
      return this.searchData?.length === 1
        ? 'item'
        : 'items'
    },
    visibleResults() {
      return this.searchData.slice(0, this.resultsToDisplay)
    }
  },
  watch: {
    searchData(newData, oldData) {
      if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
        this.resetResults()
      }
    },
    results(newVal) {
      newVal.length
        ? this.$emit('results')
        : this.$emit('no-query')
    },
    visibleResults(newVal) {
      this.isFetching = this.fetchBuffer

      newVal.forEach(async product => {
        const namespace = `product/${product.handle}`
        if (!this.$store.hasModule(namespace)) {
          this.$store.registerModule(namespace, productModule(), { preserveState: !!this.$store.state[namespace] })
          await this.$store.dispatch(`${namespace}/fetchProduct`, product.handle)
        }
        this.isFetching--
      })
    }
  },

  methods: {
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
